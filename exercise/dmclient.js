var net = require('net');
var HOST = '127.0.0.1';
var PORT = 9000;
var client = new net.Socket();

client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write the command to the server 
    getMessageList (function (ml) {
    	console.log ("here it is:")
    	console.log (JSON.stringify(ml));
    });
});

var ml_callback;

client.on ('data', function (data) {
	console.log ('data comes in: ' + data);
	var reply = JSON.parse (data.toString());
	switch (reply.what) {
		case 'get message list':
			console.log ('We received the message list');
			ml_callback (reply.obj);
			break;
		default:
			console.log ("Panic: we got this: " + reply.what);
	}
});

function getMessageList (cb) {
	var cmd = {what:'get message list'};
	ml_callback = cb;
	client.write (JSON.stringify(cmd));
}

function postMessage (msg, from, cb) {
}

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
