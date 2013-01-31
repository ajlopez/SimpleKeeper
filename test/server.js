
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
    
    test.expect(9);
    
    server.setValue('/user/1', 'adam', step1);
    
    function step1(err) {
        test.ok(!err);
        
        server.setValue('/user/2', 'eve', step2);
    }
    
    function step2(err) {
        test.ok(!err);
        
        server.setValue('/user/2', 'eve', step3);
    }

    function step3(err) {
        test.ok(!err);
        
        server.getValue('/user/1', step4);
    }

    function step4(err, value) {
        test.ok(!err);
        test.ok(value);
        test.equal(value, 'adam');
        
        server.getValue('/user/2', step5);
    }

    function step5(err, value) {
        test.ok(!err);
        test.ok(value);
        test.equal(value, 'eve');
        
        test.done();
    }
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
    
    test.expect(7);

    server.setValue('/user/1', 'adam', step1);

    function step1(err) {
        test.ok(!err);

        server.exists('/user/1', step2);
    }

    function step2(err, result) {
        test.ok(!err);
        test.equal(result, true);

        server.exists('/user', step3);
    }

    function step3(err, result) {
        test.ok(!err);
        test.equal(result, true);

        server.exists('/', step4);
    }

    function step4(err, result) {
        test.ok(!err);
        test.equal(result, true);

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
