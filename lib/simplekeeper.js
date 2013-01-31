
function SyncServer() {
    var value = null;
    
    this.getValue = function (path) {
        return value;
    }
    
    this.setValue = function (path, newvalue) {
        value = newvalue;
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}