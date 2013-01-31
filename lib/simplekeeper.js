
function SyncServer() {
    var values = { };
    
    this.getValue = function (path) {
        return values[path];
    }
    
    this.setValue = function (path, newvalue) {
        values[path] = newvalue;
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}