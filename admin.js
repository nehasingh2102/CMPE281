var mysql= require("mysql")
var request = require('request')
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cmpe"
});


var express = require('express'),
    app = express(),
    http = require('http');
//    WebSocket = require('ws'),
//    credential = require("./clientNodeCredential.json");

const cors = require('cors');
fs = require('fs');
url = require('url');
qs = require('querystring');

//var ws = new WebSocket(credential["wsClientURL"]);
app.use(cors());
app.options('*',cors());

app.post('/admin/',function(req,res){
   var body = '';
   res.setHeader('Content-Type','application/json');
   
   req.on('data', function (data) {
        body += data;   
        //console.log("Partial body: " + body);
   });
   req.on('end', function () {
       var temp = JSON.parse(body); 
       if(temp){
         console.log(body);
	//console.log('\n temp=====\n');
        console.log(temp.origin);
	temp.origin="server";
	console.log(temp.origin);
	console.log(temp);
        //var to_forward=
	var calling_client=temp.org;
	//console.log(calling_client);
	 //  ws.send(JSON.stringify(temp));
        
	
	con.query('select instkey,dbname from nodesmap where fromvalue=?',[calling_client],function(err,rows){
  		if(err) throw err;
		
		console.log('Data received from Db:\n');
  		//console.log(rows);
		//console.log(rows[0]);
		//console.log(temp.msg);
	//});
	//do Ajax call to client nodes
	//for(var i = 0; i<rows.length; i++){
	//function funcOne(input) { 
  		//var request = require('request');
  		var body=temp.msg;
		//console.log(body);
		console.log("1");
		var to_forward=rows[0].instkey;//+'ws:3000/forward';//'http://'+rows[0]+'/forward';
		var to_insert=rows[0].dbname;//'http://'+rows[0]+'/insert';
		//var client_fulladdrs=rows.end_client;
		//client_fulladdrs=String(client_fulladdrs);//'http://'+calling_client+'/forward';
		//console.log("instkey:"+to_insert);
		//console.log(to_forward);
		//two ajax-one to forward, one to insert
		//request.post(rows.end_client, {form:{key:'value'}})

  		//request.post('http://ec2-34-208-157-33.us-west-2.compute.amazonaws.com:8888/insert', {json: true, body: temp } );// {
      		//request.post('http://ec2-34-208-157-33.us-west-2.compute.amazonaws:3000/forward', {json: true, body: temp } );// {
		request.post(String(to_forward),{json: true, body: temp } );
		//request.post(String(to_insert),{json: true, body: temp } );
		//works//request.post('http://ec2-34-208-157-33.us-west-2.compute.amazonaws.com:3000/forward',{json: true, body: temp } );
		//if (!err && res.statusCode === 200) {
          		console.log("2");
			/*funcTwo(body, function(err, output) {
        	      		console.log("3");
				console.log(err, output);
          		});*/
      		//}
  	//});
//	}
	//}
	//ws.send(jsonify(rows));
	});

	//for (var i = 0; i < rows.length; i++) {
  	//	console.log(rows[i].name);
	//};

       }
  // });
	});
   res.send({result:"success"});
});

//app.post('/forward',function(req,res){
app.post('/forward',function(req,res){
   console.log("in forward");
   var body = '';
   res.setHeader('Content-Type','application/json');
   
   req.on('data', function (data) {
        body += data;   
        //console.log("Partial body: " + body);
   });
   req.on('end', function () {
       var temp = JSON.parse(body); 
       if(temp){
         console.log(body);
           //ws.send(JSON.stringify(temp));
       }
   });
   res.send({result:"success- forward"});
});

function funcTwo(input, callback) {
    // process input
    console.log("Funtwo called");
    console.log(input);
    callback(null, input);
}

/*
ws.onmessage = function(evt){
    console.log(evt.data);
}

ws.onerror = function(evt){
    console.log("Error: "+evt.data);
}
*/
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
