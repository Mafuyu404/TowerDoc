const contentful = require('contentful');
const fs = require("fs");

if (!process.env.CMS_ACCESS_TOKEN) {
    require('dotenv').config();
}

const client = contentful.createClient(parseToken());
const content = {
    lang: [],
    document: [],
    author: []
};


(async function () {
    const entries = await client.getEntries();
    entries.items.map(entry => content[entry.sys.contentType.sys.id].push(entry.fields));

    if (!fs.existsSync("./docs")) fs.mkdirSync("./docs");
    clearDirectorySync("./docs");
    const route = {};
    linkRoute(route);
    fs.writeFileSync("./route.json", JSON.stringify(route), { encoding: "utf-8" });

    content.document.forEach((document, i) => {
        let path = `./docs/${document.path}`.split("/");
        let title = path.pop();
        path = path.join("/");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        document.content = `# ${title}` + "\n" + document.content;

        fs.writeFileSync(`${path}/${document.slug}.md`, document.content, { encoding: "utf-8" });
    });


    clearDirectorySync("./lang");
    fs.mkdirSync("./lang/zh");
    fs.mkdirSync("./lang/en");
    content.lang.forEach(lang => fs.writeFileSync(`./lang/${lang.type}/${lang.field}.json`, JSON.stringify(lang.content), { encoding: "utf-8" }));
})();

function clearDirectorySync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function parseToken() {
    let result = {}
    let token = process.env.CMS_ACCESS_TOKEN;
    result.space = token.split("/")[0];
    result.environment = token.split("/")[1].split("@")[0];
    result.accessToken = token.split("/")[1].split("@")[1];
    return result;
}

function linkRoute(route) {
    const index = {};
    content.document.forEach(document => {
        if (!document.path.includes("/")) return;
        let path = document.path.split("/");
        path.pop();
        for (let i = 0; i < path.length + 1; i++) {
            let url = path.slice(0, i + 1).join("/");
            let item;
            if (!route[url]) route[url] = [];
            if (i == path.length) {
                item = `${url}/${document.slug}`;
                route[url].push(item);
            } else if (i == 0) {

            } else {
                let root = path.slice(0, i).join();
                item = url;
                if (!route[root].includes(url)) route[root].push(item);
            }
            if (item) index[item] = document.order;
        }
    });
    orderItems(route, index);
}

function orderItems(route, index) {
    for (let routeKey in route) {
        route[routeKey].sort((a, b) => index[a] - index[b]);
    }
}