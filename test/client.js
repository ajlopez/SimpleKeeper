
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

exports['Set and Get Root Value'] = function (test) {
	var server = sk.createServer();
    server.listen(3000);
    
    test.expect(4);

    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
        si.invoke(
            remote, remote.setValue, ['/', 'foo'],
            remote, remote.getValue, ['/'],
            function (err, results) {
                test.ok(!err);
                test.ok(results);
                test.equal(results[1], 'foo');
                client.end();
                server.close();
                test.done();
            }
        );
    });
};
