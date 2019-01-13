const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');

//create an HTTP server
var httpServer = http.createServer(function(request, response) {
	unifiedServer(request, response);
});

//start an HTTP server
httpServer.listen(3000, function(){
	console.log("Http service is listening on Port 3000")
});

//ssl certs
var httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
}

//create an HTTPS server
var httpsServer = https.createServer(httpsServerOptions ,function(request, response) {
	unifiedServer(request, response);
});

//start an HTTPS server
httpsServer.listen(3001, function(){
	console.log("Https service is listening on Port 3001")
});

// define unifiedServer method which is the server logic for HTTP and HTTPS
var unifiedServer = function(request, response) {
	var parsedUrl = url.parse(request.url, true); 
	var trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');
	
	// set selectedHandler as notFound by default
	var selectedHandler = handler.notFound;

	// set selectedHandler as hello handler if the method is POST and route path is hello
	if (request.method == 'POST' & typeof(router[trimmedPath]) !== 'undefined') {
		selectedHandler = router[trimmedPath];
	}

	//invoke the selected handler and set the response
	selectedHandler(function(statusCode, greeting) {
		// set content type as Json
		response.setHeader('Content-Type', 'application/json');
		// set status code
		response.writeHead(statusCode);
		// convert Json object to string
		var message = JSON.stringify(greeting);
		// return jon
		response.end(message);
	});
};

//handler object
var handler = {}

//not found handler with status code 404
handler.notFound = function(callback) {
	callback(404);
};

//hello handler with setatus code 200 and a greeting message
handler.hello = function(callback) {
	callback(200, {'greeting': 'welcome to NodeJs'});
};

// list of handlers
var router = {
	'hello' : handler.hello
}