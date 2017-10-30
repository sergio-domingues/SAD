var net = require('net');
var HOST = '127.0.0.1';
var PORT = getPortByArg();

var dm = require('./dm.js');

function getPortByArg() {
    var args = process.argv.slice(2);

    var port = 9000;

    if (args.length > 0) {
        port = args[0];
    }

    return port;
}

// Create the server socket, on client connections, bind event handlers
server = net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Conected: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

        console.log('request comes in...' + data);
        var str = data.toString();
        var invo = JSON.parse(str);
        console.log('request is:' + invo.what + ':' + str);

        var reply = {
            what: invo.what,
            invoId: invo.invoId
        };
        switch (invo.what) {
            case 'add user':
                reply.obj = dm.addUser(invo.u, invo.p)
                break;

            case 'add subject':
                reply.obj = dm.addSubject(invo.s);
                break;

            case 'get subject list':
                reply.obj = dm.getSubjectList();
                break;

            case 'get user list':
                reply.obj = dm.getUserList();
                break;

            case 'login':
                reply.obj = dm.login(invo.u, invo.p);
                break;

            case 'add private msg':
                reply.obj = dm.addPrivateMessage(invo.msg);
                break;

            case 'get private message list':
                reply.obj = dm.getPrivateMessageList(invo.u1, invo.u2);
                break;

            case 'get subject':
                reply.obj = dm.getSubject(invo.sbj);
                break;

            case 'add public message':
                reply.obj = dm.addPublicMessage(invo.msg);
                break;

            case 'get public message list':
                reply.obj = dm.getPublicMessageList(cmd.sbj);
                break;

            default:
                console.log("No action defined for that command!!!");

        }
        sock.write(JSON.stringify(reply));
    });


    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        console.log('Connection closed');
    });

});

server.listen(PORT, HOST, function () {
    console.log('Server listening on ' + HOST + ':' + PORT);
});