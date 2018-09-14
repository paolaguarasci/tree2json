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
    // console.log(result);
}


const input = path.resolve(process.argv[2]);

if (fs.statSync(input).isDirectory()) {
    result.push(read(input));
    report(result);
    save(result);
} else {
    callWithFile(result, input);
    return -1;
}



