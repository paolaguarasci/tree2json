# Another tree clone

[![npm version](https://badge.fury.io/js/tree2json.svg)](https://badge.fury.io/js/tree2json)

## Installation
```
$ npm install --save tree2json
```

## Usage (Node.js)
```
const tree = require('tree2json').tree;
const myTree = new tree();
myTree.saveToFile('./testFolder');
myTree.writeStruct('./struct.json', './anotherTestFolder');
```

## Contrib
It is a package created for the purpose of study. Feel free to participate and contribute!