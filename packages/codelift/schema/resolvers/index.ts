import { readFileSync, writeFileSync } from "fs";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import launchEditor from "react-dev-utils/launchEditor";

import { getNodeAt } from "./utils/getNodeAt";
import { findAttribute } from "./utils/findAttribute";
import { parser } from "./utils/parser";
import { setAttribute } from "./utils/setAttribute";
import { Literal, JSXExpressionContainer } from "jscodeshift";

export const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,

  Mutation: {
    openInIDE(
      _: any,
      args: {
        fileName: string;
        lineNumber: number;
      }
    ) {
      const { fileName, lineNumber } = args;

      launchEditor(fileName, lineNumber);

      return true;
    },

    toggleClassName(
      _: any,
      args: {
        className: string;
        fileName: string;
        lineNumber: number;
      }
    ) {
      const { className, fileName, lineNumber } = args;
      const ast = parser(readFileSync(fileName, "utf8"));
      const node = getNodeAt(ast, lineNumber);
      const attribute = findAttribute(node, "className");
      const [path] = attribute.paths();

      if (!path) {
        return resolvers.Mutation.updateClassName(_, args);
      }

      const literal = path.value.value;

      if (!literal) {
        const error = new Error("className has no value");

        console.error(error, path);
        throw error;
      }

      if (literal.type !== "StringLiteral") {
        const error = new Error(`TODO - Support literal ${literal.type}`);

        console.error(error, literal);
        throw error;
      }

      const classNames = new Set(
        literal.value
          .split(" ")
          .map(className => className.trim())
          .filter(Boolean)
      );

      if (classNames.has(className)) {
        classNames.delete(className);
      } else {
        classNames.add(className);
      }

      const value = setAttribute(
        node,
        "className",
        Array.from(classNames)
          .sort()
          .join(" ")
      );

      writeFileSync(fileName, ast.toSource(), "utf8");

      return value;
    },

    updateClassName(
      _: any,
      args: {
        className: string;
        fileName: string;
        lineNumber: number;
      }
    ) {
      const { className, fileName, lineNumber } = args;
      const ast = parser(readFileSync(fileName, "utf8"));
      const node = getNodeAt(ast, lineNumber);

      const value = setAttribute(node, "className", className);
      writeFileSync(fileName, ast.toSource(), "utf8");

      return value;
    },

    updateProps(
      _: any,
      args: {
        props: Record<string, any>;
        fileName: string;
        lineNumber: number;
      }
    ) {
      const { props, fileName, lineNumber } = args;
      const ast = parser(readFileSync(fileName, "utf8"));
      const node = getNodeAt(ast, lineNumber);

      Object.entries(props).forEach(([prop, value]) => {
        try {
          value = JSON.parse(value);
        } catch (error) {
          switch (value) {
            case "undefined":
              value = undefined;
              break;
            default:
              throw new Error(`Unsupported value: ${value}.  This is a bug!`);
          }
        }
        setAttribute(node, prop, value);
      });

      const updatedProps: Record<string, any> = {};

      node.find(parser.JSXAttribute).forEach(path => {
        const { name } = path.value.name;
        const { value } = ("expression" in
        (path.value.value as JSXExpressionContainer)
          ? (path.value.value as JSXExpressionContainer).expression
          : path.value.value) as Literal;

        updatedProps[name as string] = value;
      });

      writeFileSync(fileName, ast.toSource(), "utf8");

      return updatedProps;
    }
  },

  Query: {
    version() {
      return require("../../package.json").version;
    }
  }
};
