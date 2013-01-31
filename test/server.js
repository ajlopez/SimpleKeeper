
var sk = require('..');

exports['Create Server'] = function (test) {
	var server = sk.createServer();
	test.ok(server);
	test.equal(typeof server, 'object');
    test.done();
};

exports['Get Empty Root Value'] = function (test) {
	var server = sk.createServer();
    test.expect(2);
    
    var result = server.getValue('/', function(err, value) {
        test.ok(!err);
        test.equal(result, null);
        test.done();
    });
};

