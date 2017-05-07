//PAGE-WIDE VARIABLES
var infoJSON;
var searchTableHasHeader = false;
var exploreTableHasHeader = false;
var preferencesAreVisible = false;
var breadCrumbChain = [];
var searchTickers = [];
var exploreTickers = [];

var colorBreakPoint4 = 0.50;    //above or equal to this value: bright red
var colorBreakPoint3 = 0.25;    //above or equal to this value and below colorBreakPoint1: dark red
var colorBreakPoint2 = -0.25;   //above or equal to this value and below colorBreakPoint2: black
var colorBreakPoint1 = -0.50;   //above or equal to this value and below colorBreakPoint3: green
                                //below colorBreakPoint4: bright green

var dividendCoefficient = 1.0;  //sometimes the dividend doesn't move a lot, resulting in all black
                                //colors for the dividend.  this coefficient allows you to adjust the
                                //sensitivity of the dividend to colors.  greater than 1 will produce
                                //more colors, less than 1 will produce less colors.
var colors = ["brightGreen", "darkGreen", "black", "darkRed", "brightRed"];
var monochromeColors = ["whiteWithBorder", "whiteGrey", "grey", "blackGrey", "black"];

//PAGE INITIALIZATION
$(document).ready(function() {
    showHome();
    
    // Make the explore + search tables sortable
    $("#exploreTable").tablesorter();
    $("#searchTable").tablesorter();

    $.get("/info", function(data) {

        infoJSON = data;

        var securityToTicker = data["security_to_ticker"];
        var tickerToSecurity = data["ticker_to_security"];
        populateSearchSuggestions(securityToTicker);
        addEventListenerForSearch(securityToTicker, tickerToSecurity, data);
        //renderLeaderboard();
    });

});

//VISIBILITY SECTION
function showExplore() {
    // TODO
    // Add loading icon after so that we wait until infoJSON is populated.
    renderSectorLevel();
    $("#exploreButton").addClass("underline");
    $("#searchButton").removeClass("underline");
    $("#preferencesButton").removeClass("underline");
    $("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(true);
    $("#preferencesSection").toggle(false);
    $("#footer").toggle(false);
}

function showHome() {
    $("#exploreButton").removeClass("underline");
    $("#searchButton").removeClass("underline");
    $("#preferencesButton").removeClass("underline");
    $("#homeSection").toggle(true);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(false);
    $("#preferencesSection").toggle(false);
    $("#footer").toggle(true);
}

function togglePreferences() {
    if (preferencesAreVisible) {
        hidePreferences();
    } else {
        showPreferences();
    }
}

function showPreferences() {
    preferencesAreVisible = true;
    $("#preferencesSection").slideDown(500);
    $("#colorSlider").slider( "option", "values", [colorBreakPoint1Default, colorBreakPoint2Default, colorBreakPoint3Default, colorBreakPoint4Default]);
}

function hidePreferences() {
    preferencesAreVisible = false;
    $("#preferencesSection").slideUp(500);  
}

function showSearch() {
    $("#exploreButton").removeClass("underline");
    $("#searchButton").addClass("underline");
    $("#preferencesButton").removeClass("underline");
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(true);
    $("#exploreSection").toggle(false);
    $("#preferencesSection").toggle(false);
    $("#footer").toggle(false);
}

// **********************************************
// TICKER MANAGEMENT FUNCTIONS BEGIN HERE
// **********************************************

function displayTickers(listName) {
    console.log("inside displayTickers");
    if (listName == null) {
        console.log("list is empty");
    } else {
        var n = listName.length;
        for (var i = 0; i < n; i++) {
            console.log(listName[i]);
        }
    }
}

function hasTicker(listName, ticker) {
    var n = listName.length;
    for (var i = 0; i < n; i++) {
        if (listName[i] == ticker) {
            return true;
        }
    }
    return false;
}

function addTicker(listName, ticker) {
    if (!hasTicker(listName, ticker)) {
        listName.push(ticker);
    }
}

function deleteTicker(listName, ticker) {
    var n = listName.length;
    var splicePoint = 0;
    for (var i = 0; i < n; i++) {
        if (listName[i] == ticker) {
            splicePoint = i;
            break;
        }
    }
    listName.splice(splicePoint, 1);
}

function clearTickers(listName) {
    for (var i = listName.length; i > 0; i--) {
        listName.pop();
    }
}

function getTickerList(tableName) {
    var tickerList = "";
    if (tableName == "exploreTable") {
        tickerList = exploreTickers;
    } else if (tableName == "searchTable") {
        tickerList = searchTickers;
    }
    return tickerList;
}

function hardCopyList(tableName) {
    var alias = getTickerList(tableName);
    var tickerListCopy = [];
    for (var i = 0; i < alias.length; i++) {
        tickerListCopy.push(alias[i]);
    }
    return tickerListCopy;
}


// **********************************************
// SEARCH SECTION FUNCTIONS BEGIN HERE
// **********************************************

function populateSearchSuggestions(security_to_ticker) {
    var companyNames = Object.keys(security_to_ticker);
    var tickers = companyNames.map(function(v) {return security_to_ticker[v]; });

    // Will give suggestions on both company name as well as ticker
    autocompleteList = companyNames.concat(tickers);
    var input = document.getElementById("searchBarInput");
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


function processUserSelection(e, securityToTicker, tickerToSecurity, json) {
    var userSelection = e.text.trim();
    var dataForUserSelection;
    var ticker;
    if (securityToTicker.hasOwnProperty(userSelection)) {
        ticker = json["security_to_ticker"][userSelection];
    } else {
        ticker = userSelection; // User selected a ticker
    }

    if (searchTableHasHeader == false) {
        var tableHeader = makeTableHeaderString("searchTable");
        appendHeader(tableHeader, "searchTable");
        searchTableHasHeader = true;
    }
    //hand data off to rendering...
    if (!hasTicker(searchTickers, ticker)) {
        makeTableRow(ticker, "searchTable");
    }
    $("#searchBarInput").val("");
}

// **********************************************
// TABLE MANAGEMENT FUNCTIONS BEGIN HERE
// **********************************************

//appends the search result table with a row
function appendTable(str, tableName) {
    var tableId = "#" + tableName;
    var searchTable = $(tableId);
    searchTable.append(str);

}

function appendHeader(str, tableName) {
    var searchTable = $("#"+tableName);

    var thead = searchTable.find("thead")

    if(thead.length == 0) {
        searchTable.append("<thead></thead>");
    }

    var tableId = "#" + tableName + " thead";
    var searchTableHead = $(tableId);
    searchTableHead.append(str);

    activatePopups();
    // $("#"+tableName).trigger("destroy");
    // $("#"+tableName).tablesorter().trigger("update").trigger("appendCache");
}

function appendBody(str, tableName) {
    var searchTable = $("#"+tableName);

    var tbody = searchTable.find("tbody");

    if(tbody.length == 0) {
        searchTable.append("<tbody></tbody>");
    } 

    var tableId = "#" + tableName + " tbody";
    var searchTableBody = $(tableId);

    searchTableBody.append(str);
    $("#"+tableName).trigger("updateAll");
}

function makeTableRow(ticker, table) {
    //data consists of a single stock's technical information
    var data = infoJSON['technical_map'][ticker];
    s = new security(data);
    var tickerList = getTickerList(table);
    var tableRow = makeTableRowString(s, table);
    addTicker(tickerList, ticker);
    appendBody(tableRow, table);
}

//takes the json data and makes an object out of
//it, consisting of the data for a single security
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

//clears the table contents, including the header
//but does not remove the table itself from the DOM
function clearTable(tableName) {
    var str = "#" + tableName + " tr"; 
    $(str).remove();
    if (tableName == "searchTable") {
        searchTableHasHeader = false;
    } else {
        exploreTableHasHeader = false;
    }
    clearTickers(getTickerList(tableName));
}

//deletes a search result row 
function deleteSearchResult(row, tableName) {
    //citation: concept derived from w3schools.com
    var index = row.parentNode.parentNode.rowIndex;
    var security = document.getElementById(tableName).rows[index].cells[0].innerText;
    var ticker = infoJSON['security_to_ticker'][security];
    var tickerList = getTickerList(tableName);
    
    deleteTicker(tickerList, ticker);
    document.getElementById(tableName).deleteRow(index);
    if (document.getElementById(tableName).rows.length == 1) {
        document.getElementById(tableName).deleteRow(0);
    }
    $("#searchTable").trigger("update")
                     .trigger("sorton", [$("#searchTable")[0].config.sortList])
                     .trigger("appendCache")
}

//moves search results up one row
function moveSearchResultUp(row) {
    //citation: http://jsfiddle.net/shemeemsha/4dnoyo77/
    //citation: https://www.w3schools.com/jsref/met_table_deleterow.asp
    var index = row.parentNode.parentNode.rowIndex;
    if (index > 1) {
        var $element = row;
        var row = $($element).parents("tr:first"); 
        row.insertBefore(row.prev());
    }
}

//moves search results down one row
function moveSearchResultDown(row) {
    //citation: http://jsfiddle.net/shemeemsha/4dnoyo77/
    var $element = row;
    var row = $($element).parents("tr:first"); 
    row.insertAfter(row.next());
}

//renders a table row for a single security
function makeTableRowString(security, tableName) {
    //citation: arrow buttons image source: http://www.freeiconspng.com
    //citation: x-button image source: http://www.iconsdb.com
    var rowString = '<tr>';
    var link = "http://finance.yahoo.com/quote/" + security.ticker + "?p=" + security.ticker;
    rowString += "<td class='securityCellCompanyName white'><a href='" + link + "' target='_blank' class='hoverlink'>" + security.security + "</a></td>";
    rowString += renderSecurityCell(security.pe_cur, security.pe_avg, false);
    rowString += renderSecurityCell(security.ps_cur, security.ps_avg, false);
    rowString += renderSecurityCell(security.pb_cur, security.pb_avg, false);
    rowString += renderSecurityCell(security.div_cur, security.div_avg, false);
    rowString += "<td class='white'>" + security.s_rank + "</td>";
    rowString +=  '<td class="white"><button class="searchResultButton" onclick="moveSearchResultUp(this)"><img class="searchResultButtonImage" alt="up-arrow button" src="../images/up_arrow_03.png"></button></td>';
    rowString +=  '<td class="white"><button class="searchResultButton" onclick="moveSearchResultDown(this)"><img class="searchResultButtonImage" alt="down-arrow button" src="../images/down_arrow_03.png"></button></td>';
    if (tableName == "searchTable") {
        rowString += '<td class="white"><button class="searchResultButton" onclick="deleteSearchResult(this, \'' + tableName + '\')"><img style="height:22px; width:22px" class="searchResultButtonImage" alt="delete button" src="../images/x_icon_02.png"></td>';                                                           
    }
    rowString += "</tr>";
    return rowString;
}

//renders the table header row for the search result table
function makeTableHeaderString(tableName) {
    var str = '<tr class="securityTableHeader">';
    str +=  '<th class="securityCellCompanyName"></th>';
    str += makePopupHeader("peBox", "pePopup", "P/E", "P/E: price-to-earnings ratio");
    str += makePopupHeader("psBox", "psPopup", "P/S", "P/S: price-to-sales ratio");
    str += makePopupHeader("pbBox", "pbPopup", "P/B", "P/B: price-to-book ratio");
    str += makePopupHeader("divBox", "divPopup", "DIV", "<p>DIV: dividend yield</p> <p>(as a percentage)</p>");
    str += makePopupHeader("rankBox", "rankPopup", "RANK", "<p>RANK: aggregate ratio performance</p> <p>(lower = better)</p>");
    str +=  '<th class="tableHeaderCell"></th>';
    str +=  '<th class="tableHeaderCell"></th>';
    if (tableName == "searchTable") {
        str +=  '<th class="tableHeaderCell"><button class="searchResultButton" id="clearSearchTableButton" onclick="clearTable(\'' + tableName + '\')" >clear</button></th>';
    }
    str += '</tr>';
    return str;
}

function makePopupHeader(boxName, popupName, headerText, popupText) {
    var str = '<th class="tableHeaderCell popup" id="' + boxName + '" oncontextmenu="return false;">';
    str += '<span class="popuptext" id="' + popupName + '">'+ popupText +'</span>';
    str += headerText + '</th>';
    return str;
}

//renders a single cell for the search results table
function renderSecurityCell(currValue, histValue, isDividend) {
    var currValueNum = parseFloat(currValue);
    var histValueNum = parseFloat(histValue);
    var excursion = (currValueNum - histValueNum) / histValueNum;
    if (isDividend) excursion  = - dividendCoefficient * excursion; //adjust the range and flip sign
    var color = determineColor(excursion);
    var tdString = '<td class = "securityCell"><div class="securityCellContent ' + color + '">' + currValue + '</div></td>';
    return tdString;
}

//returns which color to use for the
//table cell based on the input value
function determineColor(excursion) {
    var index;
    if (isNaN(excursion)) {
        index = 2;
    }
    else {
        if (excursion >= colorBreakPoint4) {
            index = 4;
        } else if (excursion >= colorBreakPoint3) {
            index = 3;
        } else if (excursion >= colorBreakPoint2) {
            index = 2;
        } else if (excursion >= colorBreakPoint1) {
            index = 1;
        } else {
            index = 0;
        }
    }

    if(!$('#monochromeCheckbox').is(':checked')) {
        return colors[index];
    }
    else {
        return monochromeColors[index];
    }
}



// **********************************************
// EXPLORE SECTION FUNCTIONS BEGIN HERE
// **********************************************

function doBreadCrumbArrows() {
    var breadCrumbList = $("#breadCrumbList");
    var arrows = '<li> >> </li>';
    breadCrumbList.append(arrows);
}

function doCompanyBreadCrumb(companyName) {
    var list = $("#breadCrumbList");
    doBreadCrumbArrows();
    $('#industryBreadCrumb').addClass('cursorHand');

    var listItem =
        '<li id="companyBreadCrumb">'
        + companyName 
        + '</li>';
    list.append(listItem);
    $("#exploreSectorSection").toggle(false);
    $("#exploreIndustrySection").toggle(false);
    $("#exploreCompanySection").toggle(true);
    breadCrumbChain.push(companyName);
}

function doIndustryBreadCrumb(industryName) {
    var list = $("#breadCrumbList");
    doSectorBreadCrumb();
    $('#sectorBreadCrumb').addClass('cursorHand');
    doBreadCrumbArrows();

    var listItem =
        '<li id="industryBreadCrumb" onclick="doIndustryBreadCrumb(\'' + industryName + '\')">'
        + industryName 
        + '</li>';
    list.append(listItem);
    $("#exploreSectorSection").toggle(false);
    $("#exploreIndustrySection").toggle(true);
    $("#exploreCompanySection").toggle(false);
    breadCrumbChain.push(industryName);
}

function doSectorBreadCrumb() {
    var breadCrumbList = $("#breadCrumbList");
    breadCrumbList.empty();
    $("#exploreTable").empty();
    clearTickers(breadCrumbChain);
    var listItem = 
    '<li id="sectorBreadCrumb" onclick="doSectorBreadCrumb()">Sectors</li>';
    breadCrumbList.append(listItem);
    $("#exploreSectorSection").toggle(true);
    $("#exploreIndustrySection").toggle(false);
    $("#exploreCompanySection").toggle(false);

    breadCrumbChain.push("Sectors");
}

function renderIndustryLevel(sectorName) {
    var list = $("#exploreIndustryList");
    list.empty();
    var names = infoJSON['sector_to_industries'][sectorName];
    names.sort();
    var deltas = infoJSON['industry_to_delta'];
    var n = names.length;
    for (var i = 0; i < n; i++) {
        var name = names[i];
        var delta = deltas[name];
        var color = determineColor(delta);
        var listItem = renderIndustryListItem(name, color);
        list.append(listItem);
    }
    doIndustryBreadCrumb(sectorName);
}

function renderIndustryListItem(industryName, color) {
    var str = 
        '<li onclick="renderTickerLevel(\'' + industryName + '\')" class="exploreListItem">'
         +   '<div class="exploreListItemTextSection">'
         +       '<p class="exploreListItemText">'
         +           industryName
         +      '</p>'
         +   '</div>'
         +   '<div class="exploreListItemColorSection ' + color + '">'
         +   '</div>'
         + '</li>';

     return str;
}

function renderSectorLevel() {
    var list = $("#exploreSectorList");
    list.empty();

    var names = Object.keys(infoJSON['sector_to_industries']);
    var deltas = infoJSON['sector_to_delta'];
    names.sort();
    var n = names.length;
    for (var i = 0; i < n; i++) {
        var name = names[i];
        var delta = deltas[name];
        var color = determineColor(delta);
        var listItem = renderSectorListItem(name, color);
        list.append(listItem);
    }
    doSectorBreadCrumb();
}

function renderSectorListItem(sectorName, color) {
    var str = 
    '<li onclick="renderIndustryLevel(\'' + sectorName + '\')" class="exploreListItem">'
     +   '<div class="exploreListItemTextSection">'
     +       '<p class="exploreListItemText">'
     +           sectorName
     +      '</p>'
     +   '</div>'
     +   '<div class="exploreListItemColorSection ' + color + '">'
     +   '</div>'
     + '</li>';

     return str;
}

function renderTickerLevel(industryName) {
    var tableHeader = makeTableHeaderString("exploreTable");
    appendHeader(tableHeader, "exploreTable");
    exploreTableHasHeader = true;
    var tickers = infoJSON['industry_to_tickers'][industryName];
    var n = tickers.length;
    for (var i = 0; i < n; i++) {
        var ticker = tickers[i];
        makeTableRow(ticker, "exploreTable");  
    }
    doCompanyBreadCrumb(industryName);
    activatePopups();
}

function activatePopups() {
    $('#peBox').mousedown(function(e){displayToolTip(e, $('#pePopup'))});
    $('#psBox').mousedown(function(e){displayToolTip(e, $('#psPopup'))});
    $('#pbBox').mousedown(function(e){displayToolTip(e, $('#pbPopup'))});
    $('#divBox').mousedown(function(e){displayToolTip(e, $('#divPopup'))});
    $('#rankBox').mousedown(function(e){displayToolTip(e, $('#rankPopup'))});

    $('#peBox').mouseleave(function(e){
        if($('#pePopup').hasClass('show')) {
            $('#pePopup').toggleClass('show');
        }
    });
    $('#psBox').mouseleave(function(e){
        if($('#psPopup').hasClass('show')) {
            $('#psPopup').toggleClass('show');
        }
    });
    $('#pbBox').mouseleave(function(e){
        if($('#pbPopup').hasClass('show')) {
            $('#pbPopup').toggleClass('show');
        }
    });
    $('#divBox').mouseleave(function(e){
        if($('#divPopup').hasClass('show')) {
            $('#divPopup').toggleClass('show');
        }
    });
    $('#rankBox').mouseleave(function(e){
        if($('#rankPopup').hasClass('show')) {
            $('#rankPopup').toggleClass('show');
        }
    });
}

function displayToolTip(event, popup) {
    if(event.which == 3 && !popup.hasClass('show')) {
        popup.toggleClass('show');
        event.stopPropagation();
    }
}

// **********************************************
// PREFERENCES SECTION FUNCTIONS BEGIN HERE
// **********************************************


function refreshTables() {
    refreshTable("searchTable", searchTableHasHeader);

    if (breadCrumbChain.length == 1) {
        renderSectorLevel();
    } else if (breadCrumbChain.length == 2) {
        renderIndustryLevel(breadCrumbChain[1]);
    } else {
        refreshTable("exploreTable", exploreTableHasHeader);
    }
}

// Redraw the search table with latest JSON data and colors
function refreshTable(tableName, tableHeaderStatus) {
    // Don't refresh if there isn't a valid JSON file
    if(!infoJSON) {
        return;
    }

    //don't re-populate an empty table.  you will end
    //up with an orphan table header (i.e. a table header
    //with no data associated with it)
    if (tableHeaderStatus == false) {
        return;
    }

    // Clear and redraw the table
    var copiedList = hardCopyList(tableName);
    clearTable(tableName);

    tableHeader = makeTableHeaderString(tableName);
    appendHeader(tableHeader, tableName);

    // Header
    if (tableName == "searchTable") {
        searchTableHasHeader = true;       
    } else if (tableName == "exploreTable") {
        exploreTableHasHeader = true;
    }

    // Body
    for (var i = 0; i < copiedList.length; i++) {
        var ticker = copiedList[i];
        makeTableRow(ticker, tableName);
    }
}

function changeMonochrome() {
    refreshTables();
    $("#colorSlider").slider( "option", "values", [colorBreakPoint1, colorBreakPoint2, colorBreakPoint3, colorBreakPoint4]);
}


// **********************************************
// FUNCTIONS NOT BEING USED BEGIN HERE
// **********************************************

// Need to decide if we want to implement this. Displays a table of top 10 ranked securities.
function renderLeaderboard() {
    var tickers = infoJSON['leaderboard']['best'];
    var n = tickers.length;
    console.log(tickers);
    var tableHeader = makeTableHeaderString("homeTable");
    appendHeader(tableHeader, "homeTable");
    for (var i = 0; i < n; i++) {
        var ticker = tickers[i];
        makeTableRow(ticker, "homeTable");  
    }
}