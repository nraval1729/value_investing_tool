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



launchCurrentScraper();
launchValidTickersGenerator();
launchInfoJsonGenerator();

// To get home page
app.get("/", function(req, res) {
	res.render('index.html');
});

// To get search page
app.get("/search", function(req, res) {
	res.render('search.html');
});

// To get explore page
app.get("/explore", function(req, res) {
	res.render('explore.html');
});

// To get info.json
app.get("/info", function(req, res) {
	var infoFilePath = __dirname + '/public/json_files/info.json';
	console.log("Inside /info, sending current json at path: " +infoFilePath);
	res.sendFile(infoFilePath);
});


// *NEW* the spa page
app.get("/spa", function(req, res) {
	res.render('spa.html');
});

// To get current.json
app.get("/current", function(req, res) {
	var currentFilePath = __dirname + '/public/json_files/current.json';
	console.log("Inside /current, sending current json at path: " +currentFilePath);
	res.sendFile(currentFilePath);
});

// To get historical.json
app.get("/historical", function(req, res) {
	var historicalFilePath = __dirname + '/public/json_files/historical.json';
	console.log("Inside /historical, sending historical json at path: " +historicalFilePath);
	res.sendFile(historicalFilePath);
});

// To get biographical.json
app.get("/biographical", function(req, res) {
	var biographicalFilePath = __dirname + '/public/json_files/biographical.json';
	console.log("Inside /biographical, sending biographical json at path: " +biographicalFilePath);
	res.sendFile(biographicalFilePath);
});

// To get technical.json
app.get("/technical", function(req, res) {
	var technicalFilePath = __dirname + '/public/json_files/technical.json';
	console.log("Inside /technical, sending technical json at path: " +technicalFilePath);
	res.sendFile(technicalFilePath);
});

app.get("/industry_to_sector", function(req, res) {
	var path = __dirname + '/public/json_files/industry_to_sector.json';
	console.log("Inside /industry_to_sector, sending industry_to_sector.json at path: " +path);
	res.sendFile(path);
});

app.get("/industry_to_tickers", function(req, res) {
	var path = __dirname + '/public/json_files/industry_to_tickers.json';
	console.log("Inside /industry_to_tickers, sending industry_to_tickers.json at path: " +path);
	res.sendFile(path);
});

app.get("/sector_to_industries", function(req, res) {
	path = __dirname + '/public/json_files/sector_to_industries.json';
	console.log("Inside /sector_to_industries, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/security_to_industry", function(req, res) {
	path = __dirname + '/public/json_files/security_to_industry.json';
	console.log("Inside /technical, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/security_to_sector", function(req, res) {
	path = __dirname + '/public/json_files/security_to_sector.json';
	console.log("Inside /technical, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/security_to_ticker", function(req, res) {
	path = __dirname + '/public/json_files/security_to_ticker.json';
	console.log("Inside /security_to_ticker, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/ticker_to_industry", function(req, res) {
	path = __dirname + '/public/json_files/ticker_to_industry.json';
	console.log("Inside /ticker_to_industry, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/ticker_to_sector", function(req, res) {
	path = __dirname + '/public/json_files/ticker_to_sector.json';
	console.log("Inside /ticker_to_sector, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/ticker_to_security", function(req, res) {
	path = __dirname + '/public/json_files/ticker_to_security.json';
	console.log("Inside /ticker_to_security, sending technical json at path: " +path);
	res.sendFile(path);
});

app.get("/technical_map", function(req, res) {
	var path = __dirname + '/public/json_files/technical_map.json';
	console.log("Inside /technical_map, sending technical_map json at path: " +path);
	res.sendFile(path);
});

app.get("/technical_list", function(req, res) {
	var path = __dirname + '/public/json_files/technical_list.json';
	console.log("Inside /technical_list, sending technical_list json at path: " +path);
	res.sendFile(path);
});

app.get("/industry_to_tickers_map", function(req, res) {
	var path = __dirname + '/public/json_files/industry_to_tickers_map.json';
	console.log("Inside /industry_to_tickers_map, sending industry_to_tickers_map json at path: " +path);
	res.sendFile(path);
});

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