import { IParser, parser } from "./parser";

export const getNodeAt = (ast: IParser, lineNumber: number) => {
  const nodes = ast.find(parser.JSXOpeningElement).filter(path => {
    return Boolean(path.value.loc?.start.line === lineNumber);
  });

  if (!nodes.length) {
    throw new Error(`Could not find JSX component at ${lineNumber}`);
  }

  if (nodes.length > 1) {
    throw new Error(
      `Multiple JSX tags found on line ${lineNumber}. Separate them onto multiple lines.`
    );
  }

  const node = nodes.at(0);

  return node;
};
