
var sk = require('..');

exports['Create Sync Server'] = function (test) {
	var server = sk.createSyncServer();
	test.ok(server);
	test.equal(typeof server, 'object');
    test.done();
};

exports['Get Empty Root Value'] = function (test) {
	var server = sk.createSyncServer();
    var result = server.getValue('/');
    test.equal(result, null);
    test.done();
};

exports['Set and Get Root Value'] = function (test) {
	var server = sk.createSyncServer();
    server.setValue('/', 'foo');
    var result = server.getValue('/');
    test.ok(result);
    test.equal(result, 'foo');
    test.done();
};


exports['Set and Get Path Values'] = function (test) {
	var server = sk.createSyncServer();
    
    server.setValue('/user/1', 'adam');
    server.setValue('/user/2', 'eve');
    
    var result = server.getValue('/user/1');
    test.ok(result);
    test.equal(result, 'adam');
    
    result = server.getValue('/user/2');
    test.ok(result);
    test.equal(result, 'eve');
    test.done();
};

exports['Set Value Invalid Paths'] = function (test) {
	var server = sk.createSyncServer();
    
    test.ok(trycall(function () { server.setValue(null, 'adam') }), 'invalid path');
    test.ok(trycall(function () { server.setValue('', 'adam') }), 'invalid path');
    test.ok(trycall(function () { server.setValue(123, 'adam') }), 'invalid path');
    test.ok(trycall(function () { server.setValue('foo', 'adam') }), 'invalid path');
    
    test.done();
};

exports['Get Children Invalid Paths'] = function (test) {
	var server = sk.createSyncServer();
    
    test.ok(trycall(function () { server.getChildren(null) }), 'invalid path');
    test.ok(trycall(function () { server.getChildren('') }), 'invalid path');
    test.ok(trycall(function () { server.getChildren(123) }), 'invalid path');
    test.ok(trycall(function () { server.getChildren('foo') }), 'invalid path');
    
    test.done();
};

exports['Exists Invalid Paths'] = function (test) {
	var server = sk.createSyncServer();
    
    test.ok(trycall(function () { server.exists(null) }), 'invalid path');
    test.ok(trycall(function () { server.exists('') }), 'invalid path');
    test.ok(trycall(function () { server.exists(123) }), 'invalid path');
    test.ok(trycall(function () { server.exists('foo') }), 'invalid path');
    
    test.done();
};

exports['Get Value Invalid Paths'] = function (test) {
	var server = sk.createSyncServer();
    
    test.ok(trycall(function () { server.getValue(null) }), 'invalid path');
    test.ok(trycall(function () { server.getValue('') }), 'invalid path');
    test.ok(trycall(function () { server.getValue(123) }), 'invalid path');
    test.ok(trycall(function () { server.getValue('foo') }), 'invalid path');
    
    test.done();
};

exports['Exists on Non Existent Path'] = function (test) {
    var server = sk.createSyncServer();
    
    test.equal(server.exists('/user/1'), false);
    test.done();
};

exports['Exists on Existent Path'] = function (test) {
    var server = sk.createSyncServer();
    
    server.setValue('/user/1', 'adam');
    test.equal(server.exists('/user/1'), true);
    test.done();
};

exports['Exists on Existent Path and Ascendants'] = function (test) {
    var server = sk.createSyncServer();
    
    server.setValue('/user/1', 'adam');
    test.equal(server.exists('/user/1'), true);
    test.equal(server.exists('/user'), true);
    test.equal(server.exists('/'), true);
    test.done();
};

exports['Get Children'] = function (test) {
    var server = sk.createSyncServer();
    
    server.setValue('/user/1', 'adam');
    server.setValue('/user/2', 'eve');
    
    var result = server.getChildren('/user');
    
    test.ok(result);
    test.equal(2, result.length);
    test.ok(result.indexOf('1') >= 0);
    test.ok(result.indexOf('2') >= 0);
    
    test.done();
};

exports['Get Children when Empty Path'] = function (test) {
    var server = sk.createSyncServer();
    
    server.setValue('/user/1', 'adam');
    server.setValue('/user/2', 'eve');
    
    var result = server.getChildren('/users');
    
    test.equal(result, null);
    test.done();
};

exports['Delete'] = function (test) {
    var server = sk.createSyncServer();
    
    server.setValue('/user/1/name', 'adam');
    server.setValue('/user/1/age', 800);
    server.setValue('/user/2/name', 'eve');
    server.setValue('/user/2/age', 700);
    
    server.delete('/user/1');
    
    var result = server.getChildren('/user');
    
    test.ok(result);
    test.equal(result.length, 1);
    test.equal(result[0], '2');
    
    test.done();
};

function trycall(fn) {
    try {
        fn();
        return null;
    }
    catch (err) {
        return err;
    }
}

