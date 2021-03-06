# SimpleKeeper

Zookeeper-like distributed server, WIP.

## Installation

Via npm on Node:

```
npm install simplekeeper
```

## Usage

Reference in your program:

```js
var simplekeeper = require('simplekeeper');
```

In the current version (0.0.1) only local server is implemented, with two flavors: synchronous and asynchronous.

### Synchronous Server

Create a server
```js
var server = simplekeeper.createSyncServer('simplekeeper');
```

Get value
```js
var value = server.getValue('/user/1/name');
```
Return null if path does not exist.

Set value
```js
server.setValue('/user/1/name', 'adam');
server.setValue('/user/1/age', 800);
```

Get children
```js
var names = server.getChildren('/user/1'); // ['name', 'age']
```

Delete node (and its children, if any)
```js
server.delete('/user/1');
```

Exists node
```js
server.exists('/user/1'); // false after deletoin
```

Invalid path (throws exceptions)
```js
server.getValue(null);   // null
server.getValue(123);    // not a string
server.getValue('');     // empty string
server.getValue('foo');  // it does not start with /
```

### Asynchronous Server

Create a server
```js
var server = simplekeeper.createServer('simplekeeper');
```

Its functions are the same of a synchronous server, but with a callback. I.e.:
Get Value
```js
var value = server.getValue('/user/1/name', function (err, value) { ... } );
```

An asynchronous server can be exposed to other machines:
```js
server.listen(port, host);
```

A remote client:
```js
var client = simplekeeper.createClient(port, host, function (server) {
	// server is a reference to the remote server, with the same interface
	server.setValue('/user/1/name', 'Adam', callback);
});
```


## Development

```
git clone git://github.com/ajlopez/SimpleKeeper.git
cd SimpleKeeper
npm install
npm test
```

## Samples

TBD

## To do

- Samples
- Set Leader
- Distributed Server
- Invalid path when it ends with /

## Versions

- 0.0.1: Published
- 0.0.2: Under development, in master. Leader server. Distributed servers

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleKeeper) and submit
[pull requests](https://github.com/ajlopez/SimpleKeeper/pulls) � contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

