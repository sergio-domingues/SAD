var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve static html files
app.get('/', function(req, res){
    res.sendFile (__dirname + '/sem4.html');
});

io.on('connection', function(sock) {
	 console.log("Event: client connected");
	 sock.on('disconnect', function(){
      console.log('Event: client disconnected');
   });

	 sock.on('get message list', function(){
		  console.log("Event: get message list: ");
          getMessageList (function(arg){
              console.log(JSON.stringify(arg))
            sock.emit ('message list', JSON.stringify(arg));
        });  		
  	});
});

// Listen for connections !!
http.listen (10000, function () {
    console.log("Starting: server current directory:" + __dirname)
});

var messages = [{msg:'primer mensaje', from:'Foreador', ts:new Date()},
                {msg:'SEGUNDO mensaje', from:'Foreador', ts:new Date()}];

getMessageList = function (cb) {    
   
   
   
    cb(messages);
}


