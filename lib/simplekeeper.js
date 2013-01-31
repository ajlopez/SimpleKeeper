
function isValidPath(path) {
    if (!path)
        throw "invalid path";
    if (typeof path !== 'string')
        throw "invalid path";
    if (path[0] !== '/')
        throw "invalid path";
}

function SyncServer() {
    var values = { };
    
    this.getValue = function (path) {
        return values[path];
    }
    
    this.setValue = function (path, newvalue) {
        isValidPath(path);
        values[path] = newvalue;
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}