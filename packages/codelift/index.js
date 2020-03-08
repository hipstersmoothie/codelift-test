const isDev =
  process.env.NODE_ENV === "development" && typeof window === "object";
const noop = arg => arg;

module.exports.register = isDev ? require("./register") : noop;
