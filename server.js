// Express
var express = require('express');
var app = express();

// Path
var path = require('path');

// Templating
var engines = require('consolidate');
app.engine('html', engines.hogan);

app.set('views', path.join(path.join(__dirname, 'public'), 'html'));
app.set('view engine', 'html');

// Post request body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
console.log('static dir ' + path.join(__dirname, 'public'));

// Python bridge to run python from node
var spawn = require("child_process").spawn;

// COMMENTING OUT THE PYTHON JOBS FOR DELIVERABLE -Nisarg
// launchCurrentScraper();
// launchValidTickersGenerator();
// launchInfoJsonGenerator();

app.get("/", function(req, res) {
	res.render('index.html');
});

app.get("/about", function(req, res) {
	res.render('about.html');
});

app.get("/privacy_policy", function(req, res) {
	res.render('privacy_policy.html');
});

app.get("/info", function(req, res) {
	var infoFilePath = __dirname + '/public/json_files/info.json';
	console.log("Inside /info, sending current json at path: " +infoFilePath);
	res.sendFile(infoFilePath);
});


// Util functions
function launchInfoJsonGenerator() {
	var filePath = __dirname + "/public/scripts/python/info_json_generator.py";
	spawnPythonProcess(filePath);
}

function launchValidTickersGenerator() {
	var filePath = __dirname + "/public/scripts/python/valid_tickers_generator.py";
	spawnPythonProcess(filePath);
}

function launchCurrentScraper() {
	var filePath = __dirname + "/public/scripts/python/current_scraper.py";
	spawnPythonProcess(filePath);
}

function spawnPythonProcess(scriptPath) {
    var process = spawn('python',[scriptPath]);
    process.stdout.on('data', function(data) {
        console.log("Received: " +data);
    });
}

app.listen(8080);