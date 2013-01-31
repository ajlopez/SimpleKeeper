
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

function Node(parent, name, value) {
    this.children = { };
    this.parent = parent;
    this.name = name;
    this.value = value;
}

function SyncServer() {
    var root;
    
    this.getValue = function (path) {
        isValidPath(path);
        
        if (!root)
            return null;

        var node = root;
        
        while (node) {
            if (!path || path === '/')
                return node.value;
                
            var split = splitPath(path);

            var child = node.children[split.name];
            
            if (!child)
                return null;
            
            path = split.rest;
            node = child;
        }
        
        return null;
    }
    
    this.setValue = function (path, newvalue) {
        isValidPath(path);
        var node = root;
        
        if (!node)
            node = root = new Node(null, null, null);
        
        while (path && path !== '/') {
            var split = splitPath(path);

            var child = node.children[split.name];
            
            if (!child)
                child = node.children[split.name] = new Node(node, split.name, null);
            
            path = split.rest;
            node = child;
        }
        
        node.value = newvalue;
    }
    
    this.exists = function (path) {
        isValidPath(path);
        
        if (!root)
            return false;

        var node = root;
        
        while (node) {
            if (!path || path === '/')
                return true;
                
            var split = splitPath(path);

            var child = node.children[split.name];
            
            if (!child)
                return false;
            
            path = split.rest;
            node = child;
        }
        
        return false;
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}

