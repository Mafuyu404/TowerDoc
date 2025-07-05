const fs = require("fs");
const path = require("path");

let p = path.join(process.cwd(), "docusaurus.config.js");
let file = fs.readFileSync(p, { encoding: "utf-8" });
file = file.replace(`baseUrl: '/'`, `baseUrl: '/en/latest/'`);
fs.writeFileSync(p, file, { encoding: "utf-8" });