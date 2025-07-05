const contentful = require('contentful');
const fs = require("fs");
// const path = require("path");


const client = contentful.createClient({
    space: 'qrce8sbvr3xn',
    environment: 'master',
    accessToken: '8kbD78D5td8EQhJYa90ZAZfoNS09Phphi2gl8dzclq4'
});
const content = {
    author: [],
    document: []
};


(async function () {
    const entries = await client.getEntries();
    entries.items.map(entry => content[entry.sys.contentType.sys.id].push(entry.fields));

    if (!fs.existsSync("./docs")) {
        fs.mkdirSync("./docs");
    }
    clearDirectorySync("./docs");

    content.document.forEach((document, i) => {
        let path = `./docs/${document.path}`.split("/");
        let title = path.pop();
        path = path.join("/");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        let content = `---
sidebar_position: ${document.order}
---

# ${title}

${document.content}`;

        fs.writeFileSync(`${path}/${title}.md`, content, { encoding: "utf-8" });
    });
})();

function clearDirectorySync(dirPath) {
  if (fs.existsSync(dirPath)) {
    // 递归删除整个目录内容
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  // 重新创建空目录
  fs.mkdirSync(dirPath, { recursive: true });
}