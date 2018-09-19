function tree() {
    const read = function (p) {
        if (!p) p = input;
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
    };

    const save = function (result) {
        fs.writeFileSync('struct.json', JSON.stringify(result));
    };

    const report = function (result) {
        result.push({
            "type": "report",
            "directories": nDir,
            "files": nFile
        });
        return result;
    };

    const callWithFile = function (result, file) {
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
    };

    const write = function (json, parent) {
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
    };

    const fs = require("fs");
    const path = require("path");
    let nDir = 0;
    let nFile = 0;
    const result = [];
    // input = path.resolve(__dirname, input);

    this.saveToFile = function (input) {
        const dir = path.resolve(input);
        if (fs.statSync(dir).isDirectory()) {
            result.push(read(dir));
            report(result);
            save(result);
        } else {
            callWithFile(result, dir);
            return -1;
        }
    }

    this.writeStruct = function (json, writePath) {
        const file = [...JSON.parse(fs.readFileSync(json, "utf-8"))];
        write(file[0], path.resolve(writePath));
        console.log(`
        Write ${nDir} directory and skipped ${nFile} files
    `);
    }

};

exports.tree = tree;