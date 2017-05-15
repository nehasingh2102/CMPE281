var express = require('express'),
    app = express(),
    http = require('http'),
    WebSocket = require('ws'),
    credential = require("./clientNodeCredential.json");

const cors = require('cors');
fs = require('fs');
url = require('url');
qs = require('querystring');

var ws = new WebSocket(credential["wsClientURL"]);
app.use(cors());
app.options('*',cors());

app.post('/forward',function(req,res){
   var body = '';
   res.setHeader('Content-Type','application/json');
   
   req.on('data', function (data) {
        body += data;   
        //console.log("Partial body: " + body);
   });
   req.on('end', function () {
       var temp = JSON.parse(body); 
       if(temp){
         //console.log(body);
           ws.send(JSON.stringify(temp));
       }
   });
   res.send({result:"success"});
});

ws.onmessage = function(evt){
    console.log(evt.data);
}

ws.onerror = function(evt){
    console.log("Error: "+evt.data);
}

app.listen(3000, function () {
    console.log(' listening on port 3000!');
});


/* 
app.use(express.static('public'));
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
  
http.listen(3000, function() {
    console.log('listening on *:3000');
});*/
/*
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
 
wss.on('connection', function(ws) {
    ws.on('message', function(msg) {
        data = JSON.parse(msg);
        if (data.message) wss.broadcast('msg: '+ data.message);
    });
});
*/
