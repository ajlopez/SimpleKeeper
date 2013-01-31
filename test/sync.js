
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