quicknpm
========

Quickly bootstrap a node module folder layout

## Example

Create a new project:

```
$ mkdir myproject && cd myproject
$ quicknpm init
```

## Installation

```
$ npm install quicknpm --save
```

## Usage

From the command line you can bootstrap a new node module.

In the current folder:
```
$ quicknpm init
```

In a specific folder:
```
$ quicknpm init /my/custom/folder
```

## API

You can use the module from within your own node program:

```js
var QuickNPM = require('quicknpm');

var job = new QuickNPM();

job.on('complete', function(){
	
})

job.init('/my/project/folder');
```

## License

MIT