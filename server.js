// Express shit
var express = require('express');
var app = express();

// Scraperjs shit
var scraperjs = require('scraperjs');

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

launchCurrentScraper();
launchTechnicalJsonGenerator();

// To get home page
app.get("/", function(req, res) {
    launchBiographicalScraper();

	// Renders the main page
	res.render('index.html');
});

// To get current.json
app.get("/current", function(req, res) {
	currentFilePath = __dirname + '/public/json_files/current.json';
	console.log("Inside /current, sending current json at path: " +currentFilePath);
	res.sendFile(currentFilePath);
});

// To get historical.json
app.get("/historical", function(req, res) {
	historicalFilePath = __dirname + '/public/json_files/historical.json';
	console.log("Inside /historical, sending historical json at path: " +historicalFilePath);
	res.sendFile(historicalFilePath);
});

// To get biographical.json
app.get("/biographical", function(req, res) {
	biographicalFilePath = __dirname + '/public/json_files/biographical.json';
	console.log("Inside /biographical, sending biographical json at path: " +biographicalFilePath);
	res.sendFile(biographicalFilePath);
});

// To get technical.json
app.get("/technical", function(req, res) {
	technicalFilePath = __dirname + '/public/json_files/technical.json';
	console.log("Inside /technical, sending technical json at path: " +technicalFilePath);
	res.sendFile(technicalFilePath);
});

function launchCurrentScraper() {
	var filePath = __dirname + "/public/scripts/python/current_scraper.py";
	spawnPythonProcess(filePath);
}

function launchTechnicalJsonGenerator() {
	var filePath = __dirname + "/public/scripts/python/technical_json_generator.py";
    console.log("tech");
	spawnPythonProcess(filePath);
}

function launchBiographicalScraper() {
    var scriptPath = __dirname + "/public/scripts/python/biographical_scraper.py";
    spawnPythonProcess(scriptPath);
}

function spawnPythonProcess(scriptPath) {
    var process = spawn('python',[scriptPath]);
    process.stdout.on('data', function(data) {
        console.log("Received: " +data);
    });
}

app.listen(8080)