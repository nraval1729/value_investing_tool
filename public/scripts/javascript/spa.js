$(document).ready(function() {
	$.get("/info", function(data) {
		var securityToTicker = data["security_to_ticker"];
		var tickerToSecurity = data["ticker_to_security"];
		populateSearchSuggestions(securityToTicker);
		addEventListenerForSearch(securityToTicker, tickerToSecurity, data);
	});
});

function populateSearchSuggestions(security_to_ticker) {
	var companyNames = Object.keys(security_to_ticker);
	var tickers = companyNames.map(function(v) {return security_to_ticker[v]; });

	// Will give suggestions on both company name as well as ticker
	autocompleteList = companyNames.concat(tickers);
	var input = document.getElementById("searchBarInput");;
	var awesomplete = new Awesomplete(input, {
		minChars: 1,
		maxItems: 10,
		autoFirst: true
	});
	awesomplete.list = autocompleteList;
}

// User made a selection from dropdown. 
// This is fired after the selection is applied
function addEventListenerForSearch(securityToTicker, tickerToSecurity, data) {
	window.addEventListener("awesomplete-selectcomplete", function(e){
		processUserSelection(e, securityToTicker, tickerToSecurity, data);
	}, false);
}

function processUserSelection(e, securityToTicker, tickerToSecurity, data) {
	var userSelection = e.text.trim();

	var dataForUserSelection;
	if (securityToTicker.hasOwnProperty(userSelection)) {
		dataForUserSelection = data["technical_map"][securityToTicker[userSelection]];
	} else {
		// User selected a ticker
		dataForUserSelection = data["technical_map"][userSelection];
	}

    console.log(dataForUserSelection);

	// CRAIG SHOULD USE THE VARIABLE dataForUserSelection variable

	//alert(JSON.stringify(dataForUserSelection, null, 4));
}

function showExplore() {
    $("#exploreSection").toggle(true);
    $("#searchSection").toggle(false);
}

function doSomething() {
    alert("I did something");
}

// $(document).ready(function() {
//     $('#searchBarInput').keypress(function (e) {
//         if (e.which == 13) doSomething();
//     });
// });