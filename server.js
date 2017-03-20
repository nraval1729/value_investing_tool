// Express shit
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

// Python bridge to run python from node
var spawn = require("child_process").spawn;


// This chunk of code spawns a new python child process that launches the current_scraper.py to update the current.json every 5 mins
filePath = __dirname + "/public/scripts/python/current_scraper.py"
console.log("File path: " +filePath);
var process = spawn('python',[filePath]);
	process.stdout.on('data', function(data) {
		console.log("Received: " +data);
	});

// Home page handler
app.get("/", function(req, res) {

	// Spawns a new python child process that launches the biographical_historical_scraper.py to update biographical.json and historical.json
	var scriptPath = __dirname + "/public/scripts/python/biographical_historical_scraper.py";
	var process = spawn('python',[scriptPath]);
	process.stdout.on('data', function(data) {
		console.log("Received: " +data);
	});

	// Renders the main page
	res.render('index.html');
});

app.get("/current", function(req, res) {
	currentFilePath = __dirname + '/public/json_files/current.json';
	console.log("Inside /current, sending current json at path: " +currentFilePath);
	res.sendFile(currentFilePath);
});

app.get("/historical", function(req, res) {
	historicalFilePath = __dirname + '/public/json_files/historical.json';
	console.log("Inside /historical, sending historical json at path: " +historicalFilePath);
	res.sendFile(historicalFilePath);
});

app.get("/biographical", function(req, res) {
	biographicalFilePath = __dirname + '/public/json_files/biographical.json';
	console.log("Inside /biographical, sending biographical json at path: " +biographicalFilePath);
	res.sendFile(biographicalFilePath);
});

app.listen(8080)