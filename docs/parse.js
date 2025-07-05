const fs = require("fs");
const path = require("path");

const cache = fs.readdirSync(p("/cache"));
const pages = [];
let route = "cache";

if (!fs.existsSync(p(`/docs`))) fs.mkdirSync(p(`/docs`));

for (let item of cache) {
  if (fs.lstatSync(p(`/cache/${item}`)).isDirectory()) {
    if (!fs.existsSync(p(`/docs/${item}`))) fs.mkdirSync(p(`/docs/${item}`));
    const dir = fs.readdirSync(p(`/cache/${item}`));
    dir.forEach(i => handle(`${item}/${i}`));
  }
  else handle(item);
}

// while (true) {
//   const dir = fs.readdirSync(`./${route}`);
//   const item = dir.filter(i => fs.lstatSync(`./cache/${i}`).isDirectory())
//   if (item.length > 0) {
//     route
//   }
// }

function handle(file) {
  console.log("parse " + file);
  let page = fs.readFileSync(p(`/cache/${file}`), { encoding: "utf-8" });
  // if (file.includes(".md")) {
  //   page = page.replaceAll("\n", "\n\n");
  // }
  fs.writeFileSync(p(`/docs/${file}`), page);
}

function p(_path) {
  return path.resolve(__dirname + _path);
}
