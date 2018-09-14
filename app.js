const fs = require("fs");
const path = require("path");
let nDir = 0;
let nFile = 0;
const result = [];

function read(p) {
    let info = {
        "type": "",
        "name": "",
    }

    const stats = fs.statSync(p);
    info.name = path.parse(p).base;
    if (stats.isDirectory(p)) {
        info.type = 'directory';
        info.contents = [];
        fs.readdirSync(path.resolve(p)).forEach(e => {
            info.contents.push(read(p + "/" + e));
        });
        nDir++;
    } else {
        info.type = 'file';
        nFile++;
    }

    return info;
}

function save(result) {
    fs.writeFileSync('struct.json', JSON.stringify(result));
}

function report(result) {
    result.push({
        "type": "report",
        "directories": nDir,
        "files": nFile
    });
    return result;
}

function callWithFile(result, file) {
    result.push({
        "type": 'file',
        "path": file,
        "contents": []
    });
    result[0].contents.push({
        "error": "Can't open a directory",
    });
    result = report(result);
    save(result);
}

if (process.argv.length != 4) {
    console.log(`
    Use for read directory structure
        $ node app.js -r [directory]

    Use for write directory structure
        $ node app.js -w [.json struct file]
    `);
    return;
}

const opt = process.argv[2];
const input = path.resolve(process.argv[3]);
if (opt === '-r') {
    if (fs.statSync(input).isDirectory()) {
        result.push(read(input));
        report(result);
        save(result);
    } else {
        callWithFile(result, input);
        return -1;
    }
} else if (opt === '-w') {
    const file = [...JSON.parse(fs.readFileSync(input, "utf-8"))];
    // console.log(file[0]);
    write(file[0], './');
    console.log(`
        Write ${nDir} directory and skipped ${nFile} files
    `);
} else {
    console.log("Wrong input");
}

function write(json, parent) {
    if (json.type === 'directory') {
        try {
            fs.mkdirSync(path.resolve(parent) + '/' + json.name);
        } catch {
            const pathRelative = path.relative(path.resolve("./"), (path.resolve(parent) + '/' + json.name));
            console.error(pathRelative + " alredy exist!");
        }
        if (json.contents.length != undefined) {
            json.contents.forEach(e => {
                write(e, path.resolve(parent) + '/' + json.name);
            });
        }
        nDir++;
    } else {
        nFile++;
    }
    return;
}