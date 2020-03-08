import { IParser, parser } from "./parser";

export const findAttribute = (
  node: IParser,
  name: string,
  type: string = "JSXIdentifier"
) => {
  const nodes = node.find(parser.JSXAttribute, {
    name: {
      name,
      type
    }
  });

  if (nodes.length > 1) {
    throw new Error(`Found more than ${JSON.stringify(name)}`);
  }

  return nodes.at(0);
};
