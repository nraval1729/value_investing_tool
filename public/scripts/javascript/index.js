var biographicalMap = {};
var sectorMap = {};
var industryMap = {};
var technicalMap = {};

$(document).ready(function() {
	console.log("Index page is ready!");

	//Make a get request to /current to get current.json
	$.get('/current', function(data) {
		hashmapCurrent(data);
	});

	//Make a get request to /historical to get historical.json
	$.get('/historical', function(data) {
		hashmapHistorical(data);
	});

	// Make a get request to /biographical to get biographical.json
	$.get('/biographical', function(data) {
		hashmapBiographical(data);
	});

	console.log(biographicalMap);
	console.log(sectorMap);
	console.log(industryMap);
	console.log(technicalMap);
});

function hashmapCurrent(data) {

	for(var i = 0; i < data.length; i++) {
		var curr = data[i];

		//technical hashmap with fillers for historical data
		technicalMap[curr['ticker']] = [0, Number(curr['pe_cur']), 0, Number(curr['ps_cur']),
		 0, Number(curr['pb_cur']), 0, Number(curr['div_cur']), 0, 0];

	}
}

function hashmapHistorical(data) {

	for(var i = 0; i < data.length; i++) {
		var hist = data[i];

		//technical hashmap
		if(technicalMap[hist['ticker']]===undefined) {
			//handle error
		} else {
			technicalMap[hist['ticker']][0] = hist['pe_avg'];
			technicalMap[hist['ticker']][2] = hist['ps_avg'];
			technicalMap[hist['ticker']][4] = hist['pb_avg'];
			technicalMap[hist['ticker']][6] = hist['div_avg'];
			technicalMap[hist['ticker']][8] = sScore();
			technicalMap[hist['ticker']][9] = sRank();
		}

	}
}

function hashmapBiographical(data) {

	for(var i = 0; i < data.length; i++) {
		var bio = data[i];

		//biographical hashmap
		biographicalMap[bio['ticker']] = [bio['security'], bio['sector'], bio['industry']];

		//sector hashmap
		if(sectorMap[bio['sector']]===undefined) {
			sectorMap[bio['sector']] = [bio['industry']];
		} else {
			if(!sectorMap[bio['sector']].includes(bio['industry'])){
				sectorMap[bio['sector']].push(bio['industry']);
			}
		}

		//industry hashmap
		if(industryMap[bio['industry']] === undefined) {
			industryMap[bio['industry']] = [bio['ticker']];
		} else {
			industryMap[bio['industry']].push(bio['ticker']);
		}
	}
}

//TODO: functions to get score and rank
function sScore() {
    return 0;
}

function sRank() {
    return 0;
}
