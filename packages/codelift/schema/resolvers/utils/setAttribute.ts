import { IParser, parser } from "./parser";

import { findAttribute } from "./findAttribute";

export const setAttribute = (node: IParser, name: string, value?: any): any => {
  const attribute = findAttribute(node, name).at(0);
  let [path] = attribute.paths();

  if (value === undefined) {
    if (path) {
      path.prune();
    }

    return value;
  }

  // Attribute doesn't currently exist
  if (!path) {
    const [parentPath] = node.paths();

    // Create the attribute
    parentPath.value.attributes.push(
      parser.jsxAttribute(parser.jsxIdentifier(name))
    );

    return setAttribute(node, name, value);
  }

  path.value.value =
    typeof value === "string"
      ? parser.literal(value)
      : parser.jsxExpressionContainer(parser.literal(value));

  return value;
};
