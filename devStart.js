const concurrently = require('concurrently');

concurrently([
  { command: "npx tsc -w",                prefixColor: "blue",    name: "TS Build" },
  { command: "npx nodemon dist/index.js", prefixColor: "magenta", name: "Local server" },
]);