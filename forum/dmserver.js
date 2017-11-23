var dm = require('./dm.js');
//var net = require('net');
var zmq = require('zmq');

var HOST = '127.0.0.1';
var PORT = getPortByArg();


function getPortByArg() {
    var args = process.argv.slice(2);

    var port = 9000;

    if (args.length > 0) {
        port = args[0];
    }

    return port;
}

//const ESCAPE_SEQUENCE = "_&%!$!%&_";

// Create the server socket, on client connections, bind event handlers
var responder = zmq.socket('rep');
let address = "tcp://" + HOST + ":" + PORT;
console.log(address)
responder.connect(address);

responder.bind(address, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on " + address);
    }
});


responder.on('message', function (data) {

    console.log('request comes in...' + data.toString());

    var str = data.toString();

    let reply = processData(data);
    responder.send(JSON.stringify(reply));

});

// Add a 'close' event handler to this instance of socket
responder.on('close', function (fd, ep) {
    console.log('close, endpoint:', ep);
    responder.close();
});



function processData(msg) {

    var invo = JSON.parse(msg);
    console.log('request is:' + invo.what + ':' + msg);

    var reply = {
        what: invo.what,
        invoId: invo.invoId
    };

    switch (invo.what) {
        case 'add user':
            reply.obj = dm.addUser(invo.u, invo.p)
            break;

        case 'add subject':
            reply.obj = dm.addSubject(invo.sbj);
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

        case 'add private message':
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
            reply.obj = dm.getPublicMessageList(invo.sbj);
            break;

        default:
            console.log("No action defined for that command!!!");

    }
    return reply;
}