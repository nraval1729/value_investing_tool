// Exress shit
var express = require('express');
var app = express();

// Templating shit
var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname + '/public/templates');
app.set('view engine', 'html');

// Post request body parser shit.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Static files shit
app.use(express.static(__dirname + '/public'));

// Util shit to inspect shit
var util = require('util');

// Home page handler
app.get("/", function(req, res) {
	res.render('index.html');
});

app.get("/current", function(req, res) {
	filePath = __dirname + '/public/json_files/current.json';
	console.log("Inside /current, sending current json at path: " +filePath);
	res.sendFile(filePath);
});

app.get("/historical", function(req, res) {
	filePath = __dirname + '/public/json_files/historical.json';
	console.log("Inside /current, sending historical json at path: " +filePath);
	res.sendFile(filePath);
});

app.get("/biographical", function(req, res) {
	filePath = __dirname + '/public/json_files/biographical.json';
	console.log("Inside /current, sending biographical json at path: " +filePath);
	res.sendFile(filePath);
});

app.listen(8080)