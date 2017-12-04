var dm = require('./dm.js');
var zmq = require('zmq');

var HOST = '127.0.0.1';
var svPort, pubPort;


function getPortsByArg() {
    var args = process.argv.slice(2);

    if (args.length > 0 && args.length < 3) {
        svPort = args[0];
        pubPort = args[1]
    } else {
        console.log("dmserver> wrong params!\nusage: node dmserver <svPort> <pubPort>")
    }
}

// ports initialization
getPortsByArg();


// Create the pub socket for propagation of new messages 
var pubber = zmq.socket('pub');
pubber.bindSync('tcp://' + HOST + ":" + pubPort);
console.log('Publisher bound to port ' + pubPort);


// Create the server socket, on client connections, bind event handlers
var responder = zmq.socket('rep');
let address = "tcp://" + HOST + ":" + svPort;
console.log("server running on: " + address)


//client binding
responder.bind(address, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on " + address);
    }
});


responder.on('message', function (data) {
    console.log('request comes in...' + data.toString());

    let reply = processData(data);
    responder.send(JSON.stringify(reply));
});

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

            // the line below creates a loop between forum and server  
            console.log("<<<<<<<<" , invo.msg);          

            invo.msg.to =  dm.getSubjectId(invo.msg.to);

            pubber.send(['new messages', JSON.stringify(invo.msg)]);
            break;

        case 'get public message list':
            reply.obj = dm.getPublicMessageList(invo.sbj);
            break;

        default:
            console.log("No action defined for that command!!!");

    }
    return reply;
}