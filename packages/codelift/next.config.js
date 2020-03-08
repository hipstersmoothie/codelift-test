const withCSS = require("@zeit/next-css");
const { version } = require("./package.json");

module.exports = withCSS({
  devIndicators: {
    autoPrerender: false
  },
  generateBuildId() {
    return version;
  }
});
