#Another tree clone
## Installation
```
$ npm --save tree2json
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