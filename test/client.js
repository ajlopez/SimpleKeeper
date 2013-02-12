
var sk = require('..'),
    si = require('simpleinvoke');

exports['Create Server and Client'] = function (test) {
	var server = sk.createServer();
    server.listen(3000);
    
    test.expect(1);
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
        server.close();
        client.end();
        test.done();
    });
};

exports['Get Empty Root Value'] = function (test) {
	var server = sk.createServer();
    server.listen(3000);

    test.expect(3);

    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
        remote.getValue('/', function(err, value) {
            test.ok(!err);
            test.equal(value, null);
            client.end();
            server.close();
            test.done();
        });
    });
};

