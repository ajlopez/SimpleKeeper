
function SyncServer() {
    this.getValue = function (path) {
        return null;
    }
}

exports.createSyncServer = function () {
	return new SyncServer();
}