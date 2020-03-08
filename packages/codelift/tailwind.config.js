const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
  variants: {
    backgroundColor: defaultConfig.variants.backgroundColor.concat("active"),
    boxShadow: defaultConfig.variants.boxShadow.concat("active"),
    zIndex: defaultConfig.variants.zIndex.concat("hover")
  }
};
