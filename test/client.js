
var sk = require('..'),
    si = require('simpleinvoke');

exports['Create Server and Client'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
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

    test.async();

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
    
    test.async();

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

exports['Set Value Invalid Paths'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();

    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
    
        remote.setValue(null, 'adam', step1);
        
        function step1(err, value) {
            test.equal(err, 'invalid path');
            remote.setValue('', 'adam', step2);
        }
        
        function step2(err, value) {
            test.equal(err, 'invalid path');
            remote.setValue(123, 'adam', step3);
        }
        
        function step3(err, value) {
            test.equal(err, 'invalid path');
            remote.setValue('foo', 'adam', step4);
        }
        
        function step4(err, value) {
            test.equal(err, 'invalid path');
            
            client.end();
            server.close();
            test.done();
        }
    });
};

exports['Get Value Invalid Paths'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);

        remote.getValue(null, step1);
        
        function step1(err, value) {
            test.equal(err, 'invalid path');
            remote.getValue('', step2);
        }
        
        function step2(err, value) {
            test.equal(err, 'invalid path');
            remote.getValue(123, step3);
        }
        
        function step3(err, value) {
            test.equal(err, 'invalid path');
            remote.getValue('foo', step4);
        }
        
        function step4(err, value) {
            test.equal(err, 'invalid path');
            
            client.end();
            server.close();
            test.done();
        }
    });
};

exports['Exists on Existent Path and Ascendants'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);

        si.invoke(
            remote, remote.setValue, ['/user/1', 'adam'],
            remote, remote.exists, ['/user/1'],
            remote, remote.exists, ['/user'],
            remote, remote.exists, ['/'],
            function (err, results) {
                test.ok(!err);
                test.ok(results);
                test.equal(results.length, 4);
                test.equal(results[1], true);
                test.equal(results[2], true);
                test.equal(results[3], true);
                client.end();
                server.close();
                test.done();
            }
        );
    });
};

exports['Get Children'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);

        si.invoke(
            remote, remote.setValue, ['/user/1', 'adam'],
            remote, remote.setValue, ['/user/2', 'eve'],
            remote, remote.getChildren, ['/user'],
            function (err, results) {
                test.ok(!err);
                test.ok(results);
                test.equal(results.length, 3);
                test.ok(results[2].indexOf('1') >= 0);
                test.ok(results[2].indexOf('2') >= 0);
                client.end();
                server.close();
                test.done();
            }
        );
    });
};

exports['Delete'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
    
        si.invoke(
            remote, remote.setValue, ['/user/1/name', 'adam'],
            remote, remote.setValue, ['/user/1/age', 800],
            remote, remote.setValue, ['/user/2/name', 'eve'],
            remote, remote.setValue, ['/user/2/age', 700],
            remote, remote.delete, ['/user/1'],
            remote, remote.getChildren, ['/user'],
            function (err, results) {
                test.ok(!err);
                test.ok(results);
                test.equal(results.length, 6);
                test.equal(results[5].length, 1);
                test.equal(results[5][0], '2');
                client.end();
                server.close();
                test.done();
            }
        );
    });
};

exports['Delete Root'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
    
        si.invoke(
            remote, remote.setValue, ['/user/1/name', 'adam'],
            remote, remote.setValue, ['/user/1/age', 800],
            remote, remote.setValue, ['/user/2/name', 'eve'],
            remote, remote.setValue, ['/user/2/age', 700],
            remote, remote.delete, ['/'],
            remote, remote.exists, ['/user/1'],
            remote, remote.exists, ['/user/2'],
            remote, remote.exists, ['/user'],
            remote, remote.exists, ['/'],
            function (err, results) {
                test.ok(!err);
                test.ok(results);
                test.equal(results.length, 9);
                test.equal(results[5], false);
                test.equal(results[6], false);
                test.equal(results[7], false);
                test.equal(results[8], false);
                client.end();
                server.close();
                test.done();
            }
        );
    });
};

exports['Exists Invalid Paths'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
    
        remote.exists(null, step1);
        
        function step1(err, value) {
            test.equal(err, 'invalid path');
            remote.exists('', step2);
        }
        
        function step2(err, value) {
            test.equal(err, 'invalid path');
            remote.exists(123, step3);
        }
        
        function step3(err, value) {
            test.equal(err, 'invalid path');
            remote.exists('foo', step4);
        }
        
        function step4(err, value) {
            test.equal(err, 'invalid path');
            
            client.end();
            server.close();
            test.done();
        }
    });
};

exports['Delete Invalid Paths'] = function (test) {
    var server = sk.createServer();
    server.listen(3000);
    
    test.async();
    
    var client = sk.createClient(3000, function(remote) {
        test.ok(remote);
    
        remote.delete(null, step1);
        
        function step1(err, value) {
            test.equal(err, 'invalid path');
            remote.delete('', step2);
        }
        
        function step2(err, value) {
            test.equal(err, 'invalid path');
            remote.delete(123, step3);
        }
        
        function step3(err, value) {
            test.equal(err, 'invalid path');
            remote.delete('foo', step4);
        }
        
        function step4(err, value) {
            test.equal(err, 'invalid path');
            
            client.end();
            server.close();
            test.done();
        }
    });
};
