$(document).ready(function() {
	console.log("Index page is ready!");

	// Make a get request to /current to get current.json
	// $.get('/current', function(data) {
	// 	doStuffWithCurrentData(data);
	// });

	// Make a get request to /historical to get historical.json
	// $.get('/historical', function(data) {
	// 	doStuffWithHistoricalData(data);
	// });

	// Make a get request to /current to get current.json
	$.get('/biographical', function(data) {
		doStuffWithBiographicalData(data);
	});
});

function doStuffWithCurrentData(data) {
	console.log("Printing current data now.......");
	for(var i = 0; i < data.length; i++) {
			curr_object = data[i];
			console.log("ticker: " +curr_object['ticker']);
			console.log("pe_cur: " +curr_object['pe_cur']);
			console.log("ps_cur: " +curr_object['ps_cur']);
			console.log("pb_cur: " +curr_object['pb_cur']);
			console.log("div_cur: " +curr_object['div_cur']);
	}
}

function doStuffWithHistoricalData(data) {
	console.log("Printing historical data now.......");
	for(var i = 0; i < data.length; i++) {
		curr_object = data[i];
		console.log("ticker: " +curr_object['ticker']);
		console.log("pe_avg: " +curr_object['pe_avg']);
		console.log("ps_avg: " +curr_object['ps_avg']);
		console.log("pb_avg: " +curr_object['pb_avg']);
		console.log("div_cur: " +curr_object['div_avg']);	
	}
}

function doStuffWithBiographicalData(data) {
	console.log("Printing biographical data now.......");
	for(var i = 0; i < data.length; i++) {
		curr_object = data[i];
		console.log("ticker: " +curr_object['ticker']);
		console.log("security: " +curr_object['security']);
		console.log("sector: " +curr_object['sector']);
		console.log("industry: " +curr_object['industry']);
	}
}