'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin); 
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            
			var msg_string = message.utf8Data
			var split = msg_string.split(":");
			
            connection.id = split[0];
            
			if(split[1] == "connected"){
				clients.push(connection)
                
                for (var i=0; i < clients.length-1; i++) {
                    split[0] = clients[i].id;
                    var concat = split.join(':');
                    console.log(concat);
                    clients[clients.length-1].sendUTF(concat);
                }
                
			}
			
			// We simply rebroadcast all the messages and let the clients handle them
			for (var i=0; i < clients.length; i++) {
                // console.log(num++);
				clients[i].sendUTF(msg_string);
			}
        }
    });
    connection.on('close', function(connection) {
        //clients.splice(index, 1);
    });

});

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);