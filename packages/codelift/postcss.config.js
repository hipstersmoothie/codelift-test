const path = require("path");

module.exports = {
  plugins: [
    require("postcss-easy-import"),
    require("tailwindcss")(path.resolve(__dirname, "tailwind.config.js")),
    require("@fullhuman/postcss-purgecss")({
      content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
      ],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
    }),
    require("autoprefixer"),
    require("cssnano")
  ]
};
