// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10)require('dotenv').load();
require('dotenv').config();
const fetch = require('node-fetch');


const apiKey = process.env.apiKey;
const apiUrl = process.env.apiUrl;

/*let settings = {
  method: "Get",
  headers: {
    'Authorization': `Bearer ${apiKey}`, 
    'Content-Type': 'application/x-www-form-urlencoded',
    'accept-version': '1.0.0'
   }
  };

fetch(apiUrl+'/items', settings)
  	.then(res => res.json())
  	.then((json) => {
    	console.log(`Got the response, there are ${json.items.length} entries`)
});*/



var port = 8000;
var serverUrl = "localhost";

var http = require("http");
var path = require("path");
var fs = require("fs");
var express = require('express');
var app = express();
var checkMimeType = true;

console.log("Starting web server at " + serverUrl + ":" + port);

/*http.createServer( function(req, res) {
  console.log('starting server');
	var filename = "/index.html";
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
	};

	var validMimeType = true;
	var mimeType = validExtensions[ext];
	if (checkMimeType) {
		validMimeType = validExtensions[ext] != undefined;
	}

	if (validMimeType) {
		localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
    });

	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
	}

}).listen(port);

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}*/

// Express webserver
// Templating aan de hand van EJS
	// Folder van mijn templates/views kiezen
	app.set('views', './views');
	// De view engine initializeren op EJS
	app.set('view engine', 'ejs');
	// Static files zoals CSS, IMAGES routen via epxress static
	app.use(express.static(path.join(__dirname, 'public')));

// Homepage index 
app.get('/', (req, res) => res.render('index'));

// Over ons pagina
app.get('/over-dit-initiatief', (req, res) => res.render('over-ons')) 

// Gebruiksvoorwaarden pagina
app.get('/gebruiksvoorwaarden', (req, res) => res.render('gebruiksvoorwaarden')) 

// Template pagina voor meer info over video

app.get('/video/:name', (req, res) => {
	const videoName =  req.params.name;
	const data = require(__dirname + '/entries.json');
	const videoArray = data.items;
	var videoData;
	var notFound = false
	// Find the correct video data by looping through all videos
	for(let video of videoArray){
		if(video.name == videoName){
			notFound = false;
			videoData = video;
			break;	// Loop verlaten eens ik gevondne heb wat ik nodig heb
		}
		else{
			notFound = true;
		}
	};
	// Send result page to user 
	if(notFound == false){
		res.render('video-template', {
			found: true,
			title: videoData.name
			// Add more data to send to front end template
		})
	}else{
		res.render('video-template', {
			found: false
		})
	}
	
})

// Eigen video API 
const data = require(__dirname + '/entries.json')
app.get('/videoAPI', (req, res) => {
	res.header("Content-Type",'application/json');
	res.send(JSON.stringify(data.items));
})
// Start server
app.listen(port)