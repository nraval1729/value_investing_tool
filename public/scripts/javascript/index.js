var NUM_COLS = 4;
var infoJSON;

$(document).ready(function() {
	showHome();

	// Make the company table sortable
    $("#companies").tablesorter();

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
	// TODOOOO
	// Add loading icon after so that we wait until infoJSON is populated.
	$( "#exploreButton" ).addClass( "underline" );
	$( "#searchButton" ).removeClass( "underline" );
	$("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(true);

	renderSectors(infoJSON['sector_to_industries']);

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


// **********************************************
// EXPLORE SECTION FUNCTIONS BEGIN HERE
// **********************************************

function renderSectorsCaller() {
	renderSectors(infoJSON['sector_to_industries']);
}

function renderSectors(sectorToIndustries) {
    var listOfSectors = [];

    sectorTable = $('#sectors');
    
    $('#sectors tr').remove();
    industryTable = $('#industries');
    companyTable = $('#companies');

    $('#crumbSpace1').hide();
    $('#sectorCrumb').hide();
    $('#crumbSpace2').hide();
    $('#industryCrumb').hide();

    sectorTable.show();
    industryTable.hide();
    companyTable.hide();  

    listOfSectors = Object.keys(sectorToIndustries);

    var numRows = Math.ceil(listOfSectors.length / NUM_COLS);
    var index = 0;

    for(i = 0; i < numRows; i++) {
        var rowString = "<tr>";
        for(j = 0; j < NUM_COLS; j++) {
            if(index < listOfSectors.length) {
                rowString += createSectorTD(listOfSectors, index);
                index++;
            }
        }
        rowString += "</tr>";
        sectorTable.append(rowString);
    }
}

function createSectorTD(sectorNames, index) {
    var tdString = "<td class='hoverable'>";
    tdString += "<a class='spaLinks hoverlink' onclick='clickSector(this)'>" + sectorNames[index] + "</a></td>";
    return tdString;
}

function clickSector(sector) {
    $('#crumbSpace2').hide();
    $('#industryCrumb').hide();

    var nameOfSector = sector.text;

    $('#crumbSpace1').show();
    $('#sectorCrumb').show();
    $('#sectorCrumb').html(nameOfSector);

    sectorTable.hide();

    $('#industries tr').remove();
    industryTable.show();
    companyTable.hide();  

    renderIndustries(nameOfSector);
}

function renderIndustries(nameOfSector) {

	var listOfUniqueIndustries = infoJSON["sector_to_industries"][nameOfSector];

	var industryTable = $("#industries");

    var numRows = Math.ceil(listOfUniqueIndustries.length / NUM_COLS);
    var index = 0;

    var stringToAppend = "";
        for (var i = 0; i < numRows; i++) {
            stringToAppend = stringToAppend + "<tr>";
            for (var j = 0; j < NUM_COLS; j++) {
                if (index < listOfUniqueIndustries.length) {
                    stringToAppend = stringToAppend + "<td><a class='spaLinks hoverlink' onclick='clickIndustry(this)'>" + listOfUniqueIndustries[index] + "</a></td>";
                    index++;
                }      
            }
        stringToAppend = stringToAppend + "</tr>";
    }

    industryTable.append(stringToAppend);
}

function clickIndustry(industry) {
    var nameOfIndustry = industry.text;

    $('#crumbSpace2').show();
    $('#industryCrumb').show();
    $('#industryCrumb').html(nameOfIndustry);

    sectorTable.hide();
    industryTable.hide();

    $('#companies tbody').empty();
    companyTable.show();  
    renderCompanies(nameOfIndustry);
}

function renderCompanies(nameOfIndustry) {
    var companyTableBody = $("#companies tbody"); 

    var listOfTickersToCreateRows = infoJSON["industry_to_tickers"][nameOfIndustry];

    for (var index = 0; index < listOfTickersToCreateRows.length; index++) {
        companyTableBody.append(createRowString(infoJSON["technical_map"][listOfTickersToCreateRows[index]], index));
        $("#companies").trigger("update");
    }

    // Tooltip displays
    var pePopup = $('#pePopup');
    var psPopup = $('#psPopup');
    var pbPopup = $('#pbPopup');
    var divPopup = $('#divPopup');
    var rankPopup = $('#rankPopup');
    $('#peBox').mousedown(function(e){displayToolTip(e, pePopup)});
    $('#psBox').mousedown(function(e){displayToolTip(e, psPopup)});
    $('#pbBox').mousedown(function(e){displayToolTip(e, pbPopup)});
    $('#divBox').mousedown(function(e){displayToolTip(e, divPopup)});
    $('#rankBox').mousedown(function(e){displayToolTip(e, rankPopup)});

    $('#page').click(function(){
        if(pePopup.hasClass('show')) {
            pePopup.toggleClass('show');
        }
        if(psPopup.hasClass('show')) {
            psPopup.toggleClass('show');
        }
        if(pbPopup.hasClass('show')) {
            pbPopup.toggleClass('show');
        }
        if(divPopup.hasClass('show')) {
            divPopup.toggleClass('show');
        }
        if(rankPopup.hasClass('show')) {
            rankPopup.toggleClass('show');
        }
    });
}

function createRowString(companyInfo, index) {
    var rowString = "<tr>";
    var ticker = JSON.stringify(companyInfo['ticker']);
    var security = JSON.stringify(companyInfo['security']);
    ticker = removeLeadingAndTrailingQuotes(ticker);
    security = removeLeadingAndTrailingQuotes(security);

    var link = "http://finance.yahoo.com/quote/" + JSON.stringify(companyInfo['ticker']) + "?p=" + ticker ;
    rowString += "<td class='black, hoverable'><a href='" + link + "' target='_blank' class='hoverlink'>" +security  + "</a></td>";

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

function removeLeadingAndTrailingQuotes(s) {
	return s.replace(/^"(.*)"$/, '$1');
}

function displayToolTip(event, popup) {
    if(event.which == 3) {
        popup.toggleClass('show');
        event.stopPropagation();
    }
}