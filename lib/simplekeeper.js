
function isValidPath(path) {
    if (!path)
        throw "invalid path";
    if (typeof path !== 'string')
        throw "invalid path";
    if (path[0] !== '/')
        throw "invalid path";
}

function splitPath(path) {
    path = path.substring(1);
    
    if (!path)
        return null;
        
    var position = path.indexOf('/');
    
    if (position < 0)
        return { name: path };
        
    var name = path.substring(0, position);
    var rest = path.substring(position);
    
    return { name: name, rest: rest };
}

function Node(parent, name) {
    this.parent = parent;
    this.name = name;
}

function SyncServer() {
    var root;
    var fromtime = 0;
    var totime = 0;
    
    this.getNode = function (path, create) {
        if (!root)
            if (create)
                root = new Node(null, null);
            else
                return null;

        var node = root;
        
        while (path && path !== '/') {
            if (!node.children)
                if (create)
                    node.children = { };
                else
                    return null;
                    
            var split = splitPath(path);

            var child = node.children[split.name];
            
            if (!child)
                if (create)
                    child = node.children[split.name] = new Node(node, split.name);
                else
                    return null;
            
            path = split.rest;
            node = child;
        }
        
        return node;
    }
    
    this.getValue = function (path) {
        isValidPath(path);

        var node = this.getNode(path);

        if (!node)
            return null;

        if (fromtime && totime) {
            if (!node.timestamp)
                return null;
            if (node.timestamp < fromtime || node.timestamp > totime)
                return null;
        }

        return node.value;
    }
    
    this.setValue = function (path, newvalue, newtimestamp) {
        isValidPath(path);
        var node = root;
        
        var node = this.getNode(path, true);
        node.value = newvalue;
        
        if (newtimestamp)
            node.timestamp = newtimestamp;
        else if (totime)
            node.timestamp = totime;
    }
    
    this.exists = function (path) {
        isValidPath(path);

        var node = this.getNode(path);

        if (node)
            return true;

        return false;
    }
    
    this.getChildren = function (path) {
        isValidPath(path);

        var node = this.getNode(path);
        
        if (node && node.children)
            return Object.keys(node.children);
            
        return null;
    }
    
    this.delete = function (path) {
        isValidPath(path);

        var node = this.getNode(path);
        
        if (!node)
            return;
            
        if (!node.parent) {
            root = null;
            return;
        }
            
        delete node.parent.children[node.name];
    }
    
    this.updateTimestamp = function (timestamp) {
        if (totime && totime + 1 === timestamp) {
            totime = timestamp;
            return;
        }
        
        fromtime = totime = timestamp;
    }
}

function Server() {
    var server = new SyncServer();
    var leader;
    var timestamp = 0;
    var followers = [];
    
    this.getValue = function (path, fn) {
        try {
            var value = server.getValue(path);
            
            if (value === null && leader) {
                leader.getValue(path, function (err, value) {
                    if (err) {
                        if (fn)
                            fn(err);
                        return;
                    }
                    
                    server.setValue(path, value);
                    
                    if (fn)
                        fn(null, value);
                });
                return;
            }
            
            if (fn)
                fn(null, value);
        }
        catch (err) {
            if (fn)
                fn(err);
        }
    }
    
    this.setValue = function (path, value, fn) {
        if (leader) {
            leader.setValue(path, value, fn);
            return;
        }
        
        try {
            timestamp++;
            server.setValue(path, value, timestamp);
            
            followers.forEach(function (follower) {
                follower.updateNode(path, timestamp);
            });
        
            if (fn)
                fn();
        }
        catch (err) {
            if (fn)
                fn(err);
        }
    }
    
    this.updateNode = function (path, timestamp) {
        server.setValue(path, null, timestamp);
        server.updateTimestamp(timestamp);
    }
    
    this.setLeader = function (newleader) {
        leader = newleader;
        newleader.addFollower(this);
    }
    
    this.addFollower = function (follower) {
        followers.push(follower);
    }
    
    this.exists = function (path, fn) {
        try {
            var result = server.exists(path);
        
            if (fn)
                fn(null, result);
        }
        catch (err) {
            if (fn)
                fn(err);
        }
    }
    
    this.getChildren = function (path, fn) {
        try {
            var result = server.getChildren(path);
        
            if (fn)
                fn(null, result);
        }
        catch (err) {
            if (fn)
                fn(err);
        }
    }
    
    
    this.delete = function (path, fn) {
        try {
            var result = server.delete(path);
        
            if (fn)
                fn(null, result);
        }
        catch (err) {
            if (fn)
                fn(err);
        }
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}

exports.createServer = function () {
	return new Server();
}
