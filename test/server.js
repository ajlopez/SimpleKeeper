
var sk = require('..');

exports['Create Server'] = function (test) {
	var server = sk.createServer();
	test.ok(server);
	test.equal(typeof server, 'object');
    test.done();
};

