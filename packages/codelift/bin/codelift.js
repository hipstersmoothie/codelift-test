#!/usr/bin/env node

const spawn = require("cross-spawn");
const [, , ...args] = process.argv;
// TODO Use npm if package-lock.json exists
const command = "yarn";

// Start codelift
require("../server");

// Start subprocess
spawn(command, args.length ? args : ["start"], {
  stdio: "inherit"
});
