const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function getScripts() {
    if (!fs.existsSync('scripts')) {
        fs.mkdirSync('scripts');
    }
    const scriptFiles = fs.readdirSync('scripts');
    if (!scriptFiles.length) console.log('Cannot find any scripts in scripts directory.');
    return scriptFiles;
}

function getIndexPage() {
    const scripts = getScripts();
    const buttons = scripts.map(s => `
        <button 
            onclick="fetch('/${s}')"
            style="
                min-width: 100px;
                max-height: 50px;
                margin: 10px;
                text-transform: uppercase;
                border: none;
                border-radius: 5px;
                background-color: lawngreen;
            ">
            ${path.parse(s).name}
        </button>`)

    return `
    <html>
        <head>
            <title>REST Remote Control</title>
        </head>
        <body style="display: flex">
            ${buttons.join('\n')}
        </body>
    </html>`
}

const port = parseInt(process.argv[2]) || 22334;
const server = http.createServer((req, res) => {
    if (req.url.length <3) {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(getIndexPage());
        return;
    }
    
    const param = req.url.split('/').at(-1);
    console.log(param);
    if (!getScripts().includes(param)) {
        res.writeHead(404);
        res.end();
        return;
    }
    try {
        exec(path.join('scripts', param), console.log);
    } catch (e) {
        console.log(e.message);
    }
    res.writeHead(200);
    res.end();
});
server.listen(port, () => { console.log(`Server is listening at http://0.0.0.0:${port}`); });
