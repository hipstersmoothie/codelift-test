import jscodeshift from "jscodeshift";

// jscodeshift doesn't export Collection type
export type IParser = ReturnType<typeof parser>;

// This is the one we need to use to parse source code
// ? Should this change by extension
export const parser = jscodeshift.withParser("tsx");
