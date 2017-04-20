//old stuff ...
// $(function() {
// 	console.log("got here");
// 	$('#searchLink').click(function(){
// 		console.log("link was clicked");
// 	    $.get('/search', function(data) {

// 	    });
// 	});

// 	$('#exploreLink').click(function(){
// 	    $.get('/explore', function(data) {

// 	    });
// 	});
// });


$(document).ready(function() {
	/*showHome(); */ /* production: use this */
	showSearch();
	$.get("/info", function(data) {
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
	$( "#exploreButton" ).addClass( "underline" );
	$( "#searchButton" ).removeClass( "underline" );
	$("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(true);
}



//creates a new, streamlined tweet object
//consisting of id_str, author, tweetText
function security(id_str, author, tweetText) {
	this.id_str = id_str;
	this.author = author;
	this.tweetText = tweetText;
}



//prepends DOM with a single tweet
function prependDom(str) {
	//alert('inside prependDom');
	var myList = $("#myList");
	var li = $("<li></li>");
	li.html(str);
	myList.prepend(li);
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

    console.log(dataForUserSelection);
    console.log(dataForUserSelection['pe_cur']);

	// CRAIG SHOULD USE THE VARIABLE dataForUserSelection variable
	//prependDom("foo");
	//prependDom(dataForUserSelection['pe_cur']);
	renderSearchResult(dataForUserSelection);
	//alert(JSON.stringify(dataForUserSelection, null, 4));
}


//prepends DOM with a single tweet
function appendTable(str) {
	var myTable = $("#myTable");
	var tr = str;
	myTable.append(str);
	//myTable.prepend(str);
}

var hasHeader = false;

function renderSearchResult(data) {
	s = new security(data);
	if (hasHeader == false) {
		tableHeader = renderSecurityTableHeader();
		appendTable(tableHeader);
		hasHeader = true;
	}
	tableRow = renderSecurityRow(s);
	appendTable(tableRow);

	//console.log(tableHeader);
	//console.log(tableRow);
}

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


function clearSearchTable() {
	$("#clearSearchTableButton").click(function() {
		$("#myTable").empty();
	});
}


// function renderSecurityTableHeader() {
// 	var str = '<tr class="securityTableHeader">';
// 	str +=	'<th></th>';
// 	str +=	'<th>p/e</th>';
// 	str += 	'<th>p/s</th>';
// 	str +=	'<th>p/b</th>';
// 	str +=	'<th>div</th>';
// 	str +=	'<th>rank</th>';
// 	str += '</tr>';
// 	return str;
// }



function renderSecurityRow(security) {
	("inside createSecurityRow");
	//alert(security.pe_cur);
	var rowString = '<tr>';
    //var link = "http://finance.yahoo.com/quote/" + JSON.stringify(companyInfo['ticker']) + "?p=" + JSON.stringify(companyInfo['ticker']);
    var link = "http://finance.yahoo.com/quote/" + security.ticker + "?p=" + security.ticker;
    //rowString += "<th class='black, hoverable'><a href='" + link + "' target='_blank' class='hoverlink'>" + JSON.stringify(companyInfo['security']) + "</a></th>";
	rowString += "<td class='securityCellCompanyName black hoverable'><a href='" + link + "' target='_blank' class='hoverlink'>" + security.security + "</a></td>";
    rowString += renderSecurityCell(security.pe_cur, security.pe_avg, false);
    rowString += renderSecurityCell(security.ps_cur, security.ps_avg, false);
    rowString += renderSecurityCell(security.pb_cur, security.pb_avg, false);
    rowString += renderSecurityCell(security.div_cur, security.div_avg, false);
    rowString += "<td class='black'>" + security.s_rank + "</td>";
    //rowString += createTDString(companyInfo["pe_cur"], companyInfo["pe_avg"], false);//
    // rowString += createTDString(companyInfo["ps_cur"], companyInfo["ps_avg"], false);//
    // rowString += createTDString(companyInfo["pb_cur"], companyInfo["pb_avg"], false);//
    // rowString += createTDString(companyInfo["div_cur"], companyInfo["div_avg"], true);
    // rowString += "<td class='black'>" + companyInfo['s_rank'] + "</td>";
    rowString += "</tr>";
    console.log(rowString);
    return rowString;
}

function renderSecurityCell(currValue, histValue, isDividend) {
    var currValueNum = parseFloat(currValue);
    var histValueNum = parseFloat(histValue);
    var excursion = (currValueNum - histValueNum) / histValueNum;
	if (isDividend) excursion  = - 0.50 * excursion; //compress the range and flip sign
    var color = determineColor(excursion);
    var tdString = '<td class = "securityCell ' + color + '">' + currValue + '</td>';
    return tdString;
    // console.log("currValueNum", currValueNum);
    // console.log("currValue", currValue);
}

function determineColor(excursion) {
    var colors = ["brightRed", "darkRed", "black", "darkGreen", "brightGreen"];
    var index;
    //values chosen to illustrate colors for 4-12 handin
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

function createRowString(companyInfo, index) {
    var rowString = "<tr>";
    var link = "http://finance.yahoo.com/quote/" + JSON.stringify(companyInfo['ticker']) + "?p=" + JSON.stringify(companyInfo['ticker']);
    rowString += "<th class='black, hoverable'><a href='" + link + "' target='_blank' class='hoverlink'>" + JSON.stringify(companyInfo['security']) + "</a></th>";

    rowString += createTDString(companyInfo["pe_cur"], companyInfo["pe_avg"], false);
    rowString += createTDString(companyInfo["ps_cur"], companyInfo["ps_avg"], false);
    rowString += createTDString(companyInfo["pb_cur"], companyInfo["pb_avg"], false);
    rowString += createTDString(companyInfo["div_cur"], companyInfo["div_avg"], true);
    rowString += "<td class='black'>" + companyInfo['s_rank'] + "</td>";

    rowString += "</tr>";
    return rowString;
}

function createTDString(currValue, histValue, isDividend) {
    var currValueNum = parseFloat(currValue);
    var histValueNum = parseFloat(histValue);
    var colors = ["brightred", "darkred", "black", "darkgreen", "brightgreen"];
    var percent = (currValueNum - histValueNum) / histValueNum;

    if (isDividend) {
        percent  = 0.50 * percent; //compress the range
    }

    var colorIndex;

    //values chosen to illustrate colors
    //for 4-12 handin
    if (percent >= 0.60) {
        colorIndex = 0;
    } else if (percent >= 0.40) {
        colorIndex = 1;
    } else if (percent >= -0.05) {
        colorIndex = 2;
    } else if (percent >= -0.20) {
        colorIndex = 3;
    } else {
        colorIndex = 4;
    }

    //dividend "good" is opposite of other ratios
    if (isDividend) {
        colorIndex = 4 - colorIndex;
    }

    var color = colors[colorIndex];
    var tdString = "<td class = '" + color + "'>" + currValue + "</td>";
    return tdString;
}


// //takes raw batch of tweet data and returns a cleaned,
// //sorted array of 26 DOM-ready tweet objects
// function processData(data) {
// 	var tweets = [];
// 	var i;
// 	//push the data onto the array
// 	for (i = 0; i < BATCH_SIZE; i++) {
// 		var id_str = data[i].id_str;
// 		var author = data[i].user.name;
// 		var tweetText=  data[i].text;
// 		tweets.push(new tweet(id_str, author, tweetText));
// 	}
// 	//sort the array
// 	tweets.sort(COMPARISON_FUNCTION);
// 	return tweets;
// }


// //removes last element from DOM's list of tweets
// function trimDOM() {
// 	$('#myList li:last').remove();
// }

// //creates a new, streamlined tweet object
// //consisting of id_str, author, tweetText
// function tweet(id_str, author, tweetText) {
// 	this.id_str = id_str;
// 	this.author = author;
// 	this.tweetText = tweetText;
// }