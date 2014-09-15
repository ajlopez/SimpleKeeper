
var sk = require('..'),
    si = require('simpleinvoke');

exports['Create Server and Leader'] = function (test) {
	var server = sk.createServer();
    var leader = sk.createServer();

    server.setLeader(leader);
    
    test.async(5);
    
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

exports['Create Servers and Leader'] = function (test) {
	var server1 = sk.createServer();
	var server2 = sk.createServer();
    var leader = sk.createServer();

    server1.setLeader(leader);
    server2.setLeader(leader);
    
    test.async();
    
    si.invoke(
        server1, server1.setValue, ['/user/1', 'adam'],
        leader, leader.getValue, ['/user/1'],
        server1, server1.getValue, ['/user/1'],
        server2, server2.getValue, ['/user/1'],
        server2, server2.setValue, ['/user/1', 'new adam'],
        leader, leader.getValue, ['/user/1'],
        server1, server1.getValue, ['/user/1'],
        server2, server2.getValue, ['/user/1'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 8);
            test.equal(results[1], 'adam');
            test.equal(results[2], 'adam');
            test.equal(results[3], 'adam');
            test.equal(results[5], 'new adam');
            test.equal(results[6], 'new adam');
            test.equal(results[7], 'new adam');
            test.done();
        }
    );
};
