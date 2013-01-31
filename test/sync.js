
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