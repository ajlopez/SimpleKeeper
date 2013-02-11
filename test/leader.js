
var sk = require('..'),
    si = require('simpleinvoke');

exports['Create Server and Leader'] = function (test) {
	var server = sk.createServer();
    var leader = sk.createServer();

    server.setLeader(leader);
    
    test.expect(5);
    
    si.invoke(
        server, server.setValue, ['/user/1', 'adam'],
        leader, leader.getValue, ['/user/1'],
        server, server.getValue, ['/user/1'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 3);
            test.equal(results[1], 'adam');
            test.equal(results[2], 'adam');
            test.done();
        }
    );
};

