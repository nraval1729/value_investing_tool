$(function(){
	$('#searchResults').hide(); // Hide search results on load
	$('#searchBarInput').keyup(function() {
		$('#searchResults').show(); // When a user types input, show results
		var searchInput = $('#searchBarInput').val();
		var processedSearchInput = new RegExp(searchInput, "i");
		var matchingTickers = [];
		var tickerToIndustryString = JSON.stringify(tickerToIndustry);

		console.log(getIndustry(tickerToIndustry, searchInput));
		console.log(searchInput);

		$.get('/ticker_to_industry', function (data) {
			console.log(data);
		});
		
		// Below is old search code (for your reference!)
		// $.get('/historical', function(data) {
		// 	console.log("Data: " + data);
		// 	var searchOutput = '<ul class="searchResults">';
		// 	$.each(data, function(key, val) {
		// 		// if inputted ticker matches with any of the tickers in "ticker_to_industry"
		// 			// search the corresponding name of industry in "industry_to_tickers"
		// 			// append all other competitor companies within that industry
		// 		if ((val.ticker.search(processedSearchInput) != -1)) {
		// 			searchOutput += '<li>';
		// 			searchOutput += '<p>' + val.ticker + '</p>';
		// 			searchOutput += '<p>' + val.pe_avg + '</p>';
		// 			searchOutput += '<p>' + val.ps_avg + '</p>';
		// 			searchOutput += '<p>' + val.pb_avg + '</p>';
		// 			searchOutput += '<p>' + val.div_avg + '</p>';
		// 			searchOutput += '</li>';
		// 		}
		// 	});
		// 	searchOutput += '</ul>';
		// 	if (searchInput != "") {
		// 		// Output search results to searchResults table
		// 		$('#searchResults').html(searchOutput);
		// 	}
		// 	else {
		// 		$('#searchResults').html('');
		// 	}
		// });
	});
	function getIndustry(tickerToIndustry, searchInput) {
	    var industry = [];
	    for (var i in tickerToIndustry) {
	        if (typeof tickerToIndustry[i] == 'object') {
	            industry = industry.concat(getIndustry(tickerToIndustry[i], searchInput));
	            console.log("got to first if " + industry);
	        } 
	        else if (i == searchInput) {
	            industry.push(tickerToIndustry[i]);
	            console.log("got to second if")
	        }
	    }
	    return industry;
	}
	function getCompetitors() {

	}
});