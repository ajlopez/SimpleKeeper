
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
