var infoJSON;

$(document).ready(function() {
	showHome(); /* production: use this */
	/*showSearch(); */
	$.get("/info", function(data) {
		infoJSON = data;
		var securityToTicker = data["security_to_ticker"];
		var tickerToSecurity = data["ticker_to_security"];
		populateSearchSuggestions(securityToTicker);
		addEventListenerForSearch(securityToTicker, tickerToSecurity, data);
	});
});

function showHome() {
	//alert("inside showHome");
	$( "#exploreButton" ).removeClass( "underline" );
	$( "#searchButton" ).removeClass( "underline" );
	$("#logoButton").toggle(false);
    $("#homeSection").toggle(true);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(false);
}

function showSearch() {
	//alert("inside showSearch");
	$( "#exploreButton" ).removeClass( "underline" );
	$( "#searchButton" ).addClass( "underline" );
	$("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(true);
    $("#exploreSection").toggle(false);
}

function showExplore() {
	//alert("inside showExplore");
	// Add loading icon after so that we wait until infoJSON is populated.


	hello();
	renderSectors(infoJSON['sector_to_industries']);
	$( "#exploreButton" ).addClass( "underline" );
	$( "#searchButton" ).removeClass( "underline" );
	$("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(true);
}

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

	// CRAIG SHOULD USE THE VARIABLE dataForUserSelection variable
	renderSearchResult(dataForUserSelection);
}

var hasHeader = false;

//appends the search result table with a row
function appendTable(str) {
	var myTable = $("#myTable");
	var tr = str;
	myTable.append(str);
}

//takes search bar result as input, and
//renders it into the table.  also determines
//if table needs header, and adds such accordingly.
function renderSearchResult(data) {
	s = new security(data);
	if (hasHeader == false) {
		tableHeader = renderSecurityTableHeader();
		appendTable(tableHeader);
		hasHeader = true;
	}
	tableRow = renderSecurityRow(s);
	appendTable(tableRow);
}

//takes the json data and makes an
//object out of it, consisting of the 
//data for a single security
function security(data) {
	this.div_avg = data['div_avg'];
	this.div_cur = data['div_cur'];
	this.pb_avg = data['pb_avg'];
	this.pb_cur = data['pb_cur'];
	this.pe_avg = data['pe_avg'];
	this.pe_cur = data['pe_cur'];
	this.ps_avg = data['ps_avg'];
	this.ps_cur = data['ps_cur'];
	this.s_rank = data['s_rank'];
	this.security = data['security'];
	this.ticker = data['ticker'];
}

//renders the table header row for the search result table
function renderSecurityTableHeader() {
	var str = '<tr class="securityTableHeader">';
	str +=	'<td class="securityCellCompanyName"></td>';
	str +=	'<td class="securityCell">p/e</td>';
	str += 	'<td class="securityCell">p/s</td>';
	str +=	'<td class="securityCell">p/b</td>';
	str +=	'<td class="securityCell">div</td>';
	str +=	'<td class="securityCell">rank</td>';
	str += '</tr>';
	return str;
}

//EXPERIMENTAL: clear contents of security table
//not yet implemented/tested
function clearSearchTable() {
	$("#clearSearchTableButton").click(function() {
		$("#myTable").empty();
	});
}

//renders a table row for a single security
function renderSecurityRow(security) {
	("inside createSecurityRow");
	var rowString = '<tr>';
    var link = "http://finance.yahoo.com/quote/" + security.ticker + "?p=" + security.ticker;
	rowString += "<td class='securityCellCompanyName black hoverable'><a href='" + link + "' target='_blank' class='hoverlink'>" + security.security + "</a></td>";
    rowString += renderSecurityCell(security.pe_cur, security.pe_avg, false);
    rowString += renderSecurityCell(security.ps_cur, security.ps_avg, false);
    rowString += renderSecurityCell(security.pb_cur, security.pb_avg, false);
    rowString += renderSecurityCell(security.div_cur, security.div_avg, false);
    rowString += "<td class='black'>" + security.s_rank + "</td>";
    rowString += "</tr>";
    console.log(rowString);
    return rowString;
}

//renders a single cell for the table
function renderSecurityCell(currValue, histValue, isDividend) {
    var currValueNum = parseFloat(currValue);
    var histValueNum = parseFloat(histValue);
    var excursion = (currValueNum - histValueNum) / histValueNum;
	if (isDividend) excursion  = - 0.50 * excursion; //compress the range and flip sign
    var color = determineColor(excursion);
    var tdString = '<td class = "securityCell ' + color + '">' + currValue + '</td>';
    return tdString;
}

//returns which color to use for the
//table cell based on the input value
function determineColor(excursion) {
    var colors = ["brightRed", "darkRed", "black", "darkGreen", "brightGreen"];
    var index;
    //values chosen for illustration purposes
    if (excursion >= 0.60) {
        index = 0;
    } else if (excursion >= 0.40) {
        index = 1;
    } else if (excursion >= -0.05) {
        index = 2;
    } else if (excursion >= -0.20) {
        index = 3;
    } else {
        index = 4;
    }
    return colors[index];
}
