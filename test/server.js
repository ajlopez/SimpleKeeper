
var sk = require('..'),
    si = require('simpleinvoke');

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

exports['Set and Get Root Value'] = function (test) {
    var server = sk.createServer();
    
    test.expect(4);
    
    server.setValue('/', 'foo', function (err) {
        test.ok(!err);
        
        server.getValue('/', function (err, value) {
            test.ok(!err);
            test.ok(value);
            test.equal(value, 'foo');
            test.done();
        });
    });
};

exports['Set and Get Path Values'] = function (test) {
    var server = sk.createServer();
    
    test.expect(5);
    
    si.invoke(
        server, server.setValue, ['/user/1', 'adam'],
        server, server.setValue, ['/user/2', 'eve'],
        server, server.getValue, ['/user/1'],
        server, server.getValue, ['/user/2'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 4);
            test.equal(results[2], 'adam');
            test.equal(results[3], 'eve');
            test.done();
        }
    );
};

exports['Set Value Invalid Paths'] = function (test) {
    var server = sk.createServer();
    
    test.expect(4);

    server.setValue(null, 'adam', step1);
    
    function step1(err) {
        test.equal(err, 'invalid path');
        server.setValue('', 'adam', step2);
    }
    
    function step2(err) {
        test.equal(err, 'invalid path');
        server.setValue(123, 'adam', step3);
    }
    
    function step3(err) {
        test.equal(err, 'invalid path');
        server.setValue('foo', 'adam', step4);
    }
    
    function step4(err) {
        test.equal(err, 'invalid path');
        
        test.done();
    }
};

exports['Get Value Invalid Paths'] = function (test) {
    var server = sk.createServer();
    
    test.expect(4);
    
    server.getValue(null, step1);
    
    function step1(err) {
        test.equal(err, 'invalid path');
        server.getValue('', step2);
    }
    
    function step2(err) {
        test.equal(err, 'invalid path');
        server.getValue(123, step3);
    }
    
    function step3(err) {
        test.equal(err, 'invalid path');
        server.getValue('foo', step4);
    }
    
    function step4(err) {
        test.equal(err, 'invalid path');
        
        test.done();
    }
};

exports['Exists on Existent Path and Ascendants'] = function (test) {
    var server = sk.createServer();
    
    test.expect(6);

    si.invoke(
        server, server.setValue, ['/user/1', 'adam'],
        server, server.exists, ['/user/1'],
        server, server.exists, ['/user'],
        server, server.exists, ['/'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 4);
            test.equal(results[1], true);
            test.equal(results[2], true);
            test.equal(results[3], true);
            test.done();
        }
    );
};

exports['Get Children'] = function (test) {
    var server = sk.createServer();
    
    test.expect(5);

    si.invoke(
        server, server.setValue, ['/user/1', 'adam'],
        server, server.setValue, ['/user/2', 'eve'],
        server, server.getChildren, ['/user'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 3);
            test.ok(results[2].indexOf('1') >= 0);
            test.ok(results[2].indexOf('2') >= 0);
            test.done();
        }
    );
};

exports['Delete'] = function (test) {
    var server = sk.createServer();
    
    test.expect(5);
    
    si.invoke(
        server, server.setValue, ['/user/1/name', 'adam'],
        server, server.setValue, ['/user/1/age', 800],
        server, server.setValue, ['/user/2/name', 'eve'],
        server, server.setValue, ['/user/2/age', 700],
        server, server.delete, ['/user/1'],
        server, server.getChildren, ['/user'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 6);
            test.equal(results[5].length, 1);
            test.equal(results[5][0], '2');
            test.done();
        }
    );
};

exports['Delete Root'] = function (test) {
    var server = sk.createServer();
    
    test.expect(7);
    
    si.invoke(
        server, server.setValue, ['/user/1/name', 'adam'],
        server, server.setValue, ['/user/1/age', 800],
        server, server.setValue, ['/user/2/name', 'eve'],
        server, server.setValue, ['/user/2/age', 700],
        server, server.delete, ['/'],
        server, server.exists, ['/user/1'],
        server, server.exists, ['/user/2'],
        server, server.exists, ['/user'],
        server, server.exists, ['/'],
        function (err, results) {
            test.ok(!err);
            test.ok(results);
            test.equal(results.length, 9);
            test.equal(results[5], false);
            test.equal(results[6], false);
            test.equal(results[7], false);
            test.equal(results[8], false);
            test.done();
        }
    );
};

exports['Exists Invalid Paths'] = function (test) {
	var server = sk.createServer();
    
    test.expect(4);
    
    server.exists(null, step1);
    
    function step1(err) {
        test.equal(err, 'invalid path');
        server.exists('', step2);
    }
    
    function step2(err) {
        test.equal(err, 'invalid path');
        server.exists(123, step3);
    }
    
    function step3(err) {
        test.equal(err, 'invalid path');
        server.exists('foo', step4);
    }
    
    function step4(err) {
        test.equal(err, 'invalid path');
        
        test.done();
    }
};

exports['Exists Invalid Paths'] = function (test) {
    var server = sk.createServer();
    
    test.expect(4);
    
    server.exists(null, step1);
    
    function step1(err) {
        test.equal(err, 'invalid path');
        server.exists('', step2);
    }
    
    function step2(err) {
        test.equal(err, 'invalid path');
        server.exists(123, step3);
    }
    
    function step3(err) {
        test.equal(err, 'invalid path');
        server.exists('foo', step4);
    }
    
    function step4(err) {
        test.equal(err, 'invalid path');
        
        test.done();
    }
};

exports['Delete Invalid Paths'] = function (test) {
    var server = sk.createServer();
    
    test.expect(4);
    
    server.delete(null, step1);
    
    function step1(err) {
        test.equal(err, 'invalid path');
        server.delete('', step2);
    }
    
    function step2(err) {
        test.equal(err, 'invalid path');
        server.delete(123, step3);
    }
    
    function step3(err) {
        test.equal(err, 'invalid path');
        server.delete('foo', step4);
    }
    
    function step4(err) {
        test.equal(err, 'invalid path');
        
        test.done();
    }
};
