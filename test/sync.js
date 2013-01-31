
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