const { createServer } = require("http");
const next = require("next");
const open = require("open");
const { parse } = require("url");
const waitForLocalhost = require("wait-for-localhost");

const dir = __dirname;
// Test if we're in the monorepo
const dev =
  process.env.NODE_ENV === "production"
    ? false
    : __dirname.includes("dist")
    ? false
    : __dirname.includes("codelift/packages/codelift");

const { PORT = 1337 } = process.env;

const app = next({ dev, dir });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/api") {
        handle(req, res);
      } else {
        app.render(req, res, "/", query);
      }
    }).listen(PORT, async err => {
      if (err) throw err;

      console.log(
        `☁️  codelift waiting for http://localhost:3000/ to start...`
      );
      await waitForLocalhost({ port: 3000 });

      const url = `http://localhost:${PORT}`;

      console.log(`☁️  codelift started on ${url}`);
      open(url, { url: true });
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
