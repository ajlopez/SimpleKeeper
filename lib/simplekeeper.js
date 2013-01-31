
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
    
    function getNode(path, create) {
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

        var node = getNode(path);

        if (!node)
            return null;

        return node.value;
    }
    
    this.setValue = function (path, newvalue) {
        isValidPath(path);
        var node = root;
        
        var node = getNode(path, true);
        node.value = newvalue;
    }
    
    this.exists = function (path) {
        isValidPath(path);

        var node = getNode(path);
        
        if (node)
            return true;

        return false;
    }
    
    this.getChildren = function (path) {
        isValidPath(path);

        var node = getNode(path);
        
        if (node && node.children)
            return Object.keys(node.children);
            
        return null;
    }
    
    this.delete = function (path) {
        isValidPath(path);

        var node = getNode(path);
        
        if (!node)
            return;
            
        delete node.parent.children[node.name];
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}

