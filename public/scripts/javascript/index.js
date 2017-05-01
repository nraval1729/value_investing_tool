//PAGE-WIDE VARIABLES
var NUM_COLS = 4;
var infoJSON;
// old values we used for demo purposes
// var colorBreakPoint1 = 0.60;
// var colorBreakPoint2 = 0.40;
// var colorBreakPoint3 = -0.05;
// var colorBreakPoint4 = -0.20;
// var dividend_compression = 0.50;
var colorBreakPoint4 = 0.50;    //above or equal to this value: bright red
var colorBreakPoint3 = 0.25;    //above or equal to this value and below colorBreakPoint1: dark red
var colorBreakPoint2 = -0.25;   //above or equal to this value and below colorBreakPoint2: black
var colorBreakPoint1 = -0.50;   //above or equal to this value and below colorBreakPoint3: green
                                //below colorBreakPoint4: bright green

var dividendCoefficient = 1.0;  //sometimes the dividend doesn't move a lot, resulting in all black
                                //colors for the dividend.  this coefficient allows you to adjust the
                                //sensitivity of the dividend to colors.  greater than 1 will produce
                                //more colors, less than 1 will produce less colors.
//PAGE INITIALIZATION

//whether or not user is currently logged in
var loggedIn = false;

$(document).ready(function() {

    $.post("/", function(data) {

        if(data["loggedIn"] == true) {
            loggedIn = true;
            $("#loginButton").html("My Account");
            $("#dropdownHi").html("Email: " + data["email"]);
        } else {
            loggedIn = false;
        }
    });

    showHome();

    // Make the companies and search results table sortable
    //$("#companies").tablesorter();
    //$("#searchTable").tablesorter();

    $.get("/info", function(data) {
        infoJSON = data;
        var securityToTicker = data["security_to_ticker"];
        var tickerToSecurity = data["ticker_to_security"];
        populateSearchSuggestions(securityToTicker);
        addEventListenersForSearch(securityToTicker, tickerToSecurity, data);
    });
});

//VISIBILITY SECTION
function showHome() {
    $( "#exploreButton" ).removeClass( "underline" );
    $( "#searchButton" ).removeClass( "underline" );
    $( "#preferencesButton" ).removeClass( "underline" );
    $("#logoButton").toggle(false);
    $("#homeSection").toggle(true);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(false);
    $("#preferencesSection").toggle(false);
    $("#dropDown2").toggle(false);
}

function showSearch() {
    $( "#exploreButton" ).removeClass( "underline" );
    $( "#searchButton" ).addClass( "underline" );
    $( "#preferencesButton" ).removeClass( "underline" );
    $("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(true);
    $("#exploreSection").toggle(false);
    $("#preferencesSection").toggle(false);
    $("#searchTable").hide();
}

function showExplore() {
    // TODO
    // Add loading icon after so that we wait until infoJSON is populated.
    $( "#exploreButton" ).addClass( "underline" );
    $( "#searchButton" ).removeClass( "underline" );
    $( "#preferencesButton" ).removeClass( "underline" );
    $("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(true);
    $("#preferencesSection").toggle(false);

    renderSectors(infoJSON['sector_to_industries']);
}

function showPreferences() {
    $( "#exploreButton" ).removeClass( "underline" );
    $( "#searchButton" ).removeClass( "underline" );
    $( "#preferencesButton" ).addClass( "underline" );
    $("#logoButton").toggle(true);
    $("#homeSection").toggle(false);
    $("#searchSection").toggle(false);
    $("#exploreSection").toggle(false);
    $("#preferencesSection").toggle(true);


}

function showLogin() {
    if(!loggedIn) {
        $("#dropDown").toggle("show");
    } else {
        $("#dropDown2").toggle("show");
    }
}

function tryLogin() {
    let username = $("#dropdownUsername").val();
    let password = $("#dropdownPassword").val();
    let postParameters = {
        username: username,
        password: password,
    }
    if (username.length == 0 || password.length == 0) {

        $("#incorrectPass").html("Please fill in both fields");
    } else {
        $.post("/validate", postParameters, function(response) {
            if(response["message"] == "username") {
                $("#incorrectPass").html("Username not found");
            } else if(response["message"] == "password") {
                $("#incorrectPass").html("Incorrect password");
            } else {
                //$("#loginButton").html("Logout of  "+ response["user"]);
                $("#dropdownUsername").val("");
                $("#loginButton").html("My Account");
                $("#dropDown").toggle("show");
                $("#incorrectPass").html("");
                $("#dropdownHi").html("Email: " + response["user"]);
                loggedIn = true;
            }
            $("#dropdownPassword").val("");
        });
    }
}

function logout() {

    $.post("/logout", function(response) {


        $("#dropDown2").toggle("show");
        loggedIn = false;
        $("#loginButton").html("Login");

    });

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

function addEventListenersForSearch(securityToTicker, tickerToSecurity, data) {

    // Enable user selection from drop-down/pressing enter
    window.addEventListener("awesomplete-selectcomplete", function(e){
        processUserSelection(e.text.trim(), securityToTicker, tickerToSecurity, data);
    }, false);

    // Enable searching by clicking on search icon
    var searchIcon = $("#searchBarDecorationWrapper");
    // searchIcon.style.cursor = 'pointer';
    searchIcon.click(function() {
        processUserSelection($("#searchBarInput").val().trim(), securityToTicker, tickerToSecurity, data)
    });
}

function processUserSelection(userSelection, securityToTicker, tickerToSecurity, data) {

    var dataForUserSelection;
    if (securityToTicker.hasOwnProperty(userSelection)) {
        dataForUserSelection = data["technical_map"][securityToTicker[userSelection]];
    } else {
        // User selected a ticker
        if(tickerToSecurity.hasOwnProperty(userSelection)) {
            dataForUserSelection = data["technical_map"][userSelection];
        }
        else {
            alert("Not found");
        }
    }

    //hand data off to rendering...
    renderSearchResult(dataForUserSelection);

    $("#searchBarInput").val("");
}

var hasHeader = false; // TODO - put this in a better place

//appends the search result table with a row to thead
function appendTableHeader(str) {
    var searchTableHeader = $("#searchTable thead");
    var tr = str;
    searchTableHeader.append(str);
}

//appends the search result table with a row to tbody
function appendTableBody(str) {
    var searchTableBody = $("#searchTable tbody");
    var tr = str;
    searchTableBody.append(str);
}

//takes search bar result as input, and renders it into the table.  also determines if table needs header, and adds such accordingly.
function renderSearchResult(data) {
    //todo: clear the search bar
    s = new security(data);

    var searchTable = $("#searchTable");
    searchTable.show();
    tableRow = renderSecurityRow(s);
    appendTableBody(tableRow);

    //commented because there is an error
    /*
    // Tell sorter that new values were inserted into the table - experimental
    searchTable.trigger("update")
               .trigger("sorton", [searchTable.get(0).config.sortList])
               .trigger("appendCache")
               .trigger("applyWidgets");;
    */

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

//renders the table header row for the search result table
function renderSecurityTableHeader() {
    var str = '<tr class="securityTableHeader">';
    str +=  '<th class="securityCellCompanyName"></th>';
    str +=  '<th class="securityCell">P/E</th>';
    str +=  '<th class="securityCell">P/S</th>';
    str +=  '<th class="securityCell">P/B</th>';
    str +=  '<th class="securityCell">DIV</th>';
    str +=  '<th class="securityCell">RANK</th>';
    str +=  '<th class="securityCell"></th>';
    str +=  '<th class="securityCell"></th>';
    str +=  '<th class="securityCell"><button class="searchResultButton" id="clearSearchTableButton" onclick="clearSearchTable()">clear</button></th>';
    str += '</tr>';
    return str;
}

//clears the table contents, including the header but does not remove the table itself from the DOM
function clearSearchTable() {
    $("#searchTable").hide();
    $("#searchTable tbody").empty();

    // Remove cleared rows from cache. Prevent redrawing deleted rows
    $("#searchTable").trigger("update");
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
function renderSecurityRow(security) {
    //citation: arrow buttons image source: http://www.freeiconspng.com
    //citation: x-button image source: http://www.iconsdb.com
    var rowString = '<tr>';
    var link = "http://finance.yahoo.com/quote/" + security.ticker + "?p=" + security.ticker;
    rowString += "<td class='securityCellCompanyName black'><a href='" + link + "' target='_blank' class='hoverlink'>" + security.security + "</a></td>";
    rowString += renderSecurityCell(security.pe_cur, security.pe_avg, false);
    rowString += renderSecurityCell(security.ps_cur, security.ps_avg, false);
    rowString += renderSecurityCell(security.pb_cur, security.pb_avg, false);
    rowString += renderSecurityCell(security.div_cur, security.div_avg, false);
    rowString += "<td class='black'>" + security.s_rank + "</td>";
    rowString +=  '<td class="black"><button class="searchResultButton" onclick="moveSearchResultUp(this)"><img class="searchResultButtonImage" alt="up-arrow button" src="../images/up_arrow_01.png"></button></td>';
    rowString +=  '<td class="black"><button class="searchResultButton" onclick="moveSearchResultDown(this)"><img class="searchResultButtonImage" alt="down-arrow button" src="../images/down_arrow_01.png"></button></td>';
    rowString += '<td class="black"><button class="searchResultButton" onclick="deleteSearchResult(this)"><img style="height:22px; width:22px" class="searchResultButtonImage" alt="delete button" src="../images/x_icon_01.png"></td>';

    //TODO STEPHEN

    rowString += '<td class="black"><button class="searchResultButton" value="' + security.ticker + '" id="' + security.ticker + 'Button" onclick="saveResult(this)">save</td>';

    rowString += "</tr>";
    return rowString;
}

//saves ticker to personal portfolio
function saveResult(row) {


    if(loggedIn) {
        tick = row.value;
        var postParameters = {ticker: tick};
        //save
        if($("#" + tick + "Button").html() == "save") {
            $.post("/addFav", postParameters, function(res) {
                $("#" + row.id).html("unsave");
            });
        //unsave
        } else {
            $.post("/removeFav", postParameters, function(res) {
                $("#" + row.id).html("save");
            });
        }
    //must be logged in to save
    } else {
        alert("Must be logged in to save.")
    }
}
function loadSaved() {
    if(loggedIn) {
        $.post("/loadSaved", function(res) {
            var tickerList = res['list'];

            for(var i = 0; i < tickerList.length; i++) {
                var dataForUserSelection = infoJSON["technical_map"][tickerList[i]];
                renderSearchResult(dataForUserSelection);
            }
        });
    } else {
        alert("Must be logged in to load all saved.")
    }
}


//deletes a search result row
function deleteSearchResult(row) {
    row.closest('tr').remove();

    // Trigger update so table sorter removes this row from cache; prevent redrawing deleted rows.
    $("#searchTable").trigger("update");
}

//renders a single cell for the search results table
function renderSecurityCell(currValue, histValue, isDividend) {
    var currValueNum = parseFloat(currValue);
    var histValueNum = parseFloat(histValue);
    var excursion = (currValueNum - histValueNum) / histValueNum;
    if (isDividend) excursion  = - dividendCoefficient * excursion; //adjust the range and flip sign
    var color = determineColor(excursion);
    var tdString = '<td class = "securityCell ' + color + '">' + currValue + '</td>';
    return tdString;
}

//returns which color to use for the table cell based on the input value note: excursion is how far away from zero (do some research on audio speakers to see usage of this word "speaker excursion")
function determineColor(excursion) {
    var colors = ["brightRed", "darkRed", "black", "darkGreen", "brightGreen"];
    var index;
    //values chosen for illustration purposes
    if (excursion >= colorBreakPoint4) {
        index = 0;
    } else if (excursion >= colorBreakPoint3) {
        index = 1;
    } else if (excursion >= colorBreakPoint2) {
        index = 2;
    } else if (excursion >= colorBreakPoint1) {
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

    for (i = 0; i < numRows; i++) {
        var rowString = "<tr>";
        for (j = 0; j < NUM_COLS; j++) {
            if (index < listOfSectors.length) {
                rowString += createSectorTD(listOfSectors, index);
                index++;
            }
        }
        rowString += "</tr>";
        sectorTable.append(rowString);
    }
}

function createSectorTD(sectorNames, index) {
    var tdString = "<td class='exploreTD1 '>";
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
                    stringToAppend = stringToAppend + "<td class='exploreTD1'><a class='hoverlink' onclick='clickIndustry(this)'>" + listOfUniqueIndustries[index] + "</a></td>"; //removed spalinks as a class for the a tag, as it is not in the css collection
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
        var rowString = createRowString(infoJSON["technical_map"][listOfTickersToCreateRows[index]]);
        companyTableBody.append(rowString);
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

    $('#peBox').mouseleave(function(e){
        if(pePopup.hasClass('show')) {
            pePopup.toggleClass('show');
        }
    });
    $('#psBox').mouseleave(function(e){
        if(psPopup.hasClass('show')) {
            psPopup.toggleClass('show');
        }
    });
    $('#pbBox').mouseleave(function(e){
        if(pbPopup.hasClass('show')) {
            pbPopup.toggleClass('show');
        }
    });
    $('#divBox').mouseleave(function(e){
        if(divPopup.hasClass('show')) {
            divPopup.toggleClass('show');
        }
    });
    $('#rankBox').mouseleave(function(e){
        if(rankPopup.hasClass('show')) {
            rankPopup.toggleClass('show');
        }
    });
}

function createRowString(companyInfo) {
    var rowString = "<tr class='height:10px'>";
    var ticker = JSON.stringify(companyInfo['ticker']);
    var security = JSON.stringify(companyInfo['security']);
    ticker = removeLeadingAndTrailingQuotes(ticker);
    security = removeLeadingAndTrailingQuotes(security);

    var link = "http://finance.yahoo.com/quote/" + ticker + "?p=" + ticker ;
    rowString += "<th class='exploreHeatMapTH hoverlink'><a href='" + link + "' target='_blank' class='hoverlink'>" +security  + "</a></th>";

    rowString += renderSecurityCell(companyInfo["pe_cur"], companyInfo["pe_avg"], false);
    rowString += renderSecurityCell(companyInfo["ps_cur"], companyInfo["ps_avg"], false);
    rowString += renderSecurityCell(companyInfo["pb_cur"], companyInfo["pb_avg"], false);
    rowString += renderSecurityCell(companyInfo["div_cur"], companyInfo["div_avg"], true);
    rowString += "<td class='exploreTD2 black'>" + companyInfo['s_rank'] + "</td>";


    rowString += "</tr>";
    return rowString;
}

function removeLeadingAndTrailingQuotes(s) {
    return s.replace(/^"(.*)"$/, '$1');
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

// Redraw the search table with latest JSON data and colors
function refreshSearchTableData() {

    // Don't refresh if there isn't a valid JSON file
    if(!infoJSON) {
        return;
    }

    var data = infoJSON;
    var securityToTicker = data["security_to_ticker"];
    var tickerToSecurity = data["ticker_to_security"];

    var rowsToAdd = "";

    $('#searchTable tr').each(function() {
        var securityName = $(this).find("td:first").text();
        console.log("securityName = " + securityName);

        if(securityName) {
            var thisSecurityData = data["technical_map"][securityToTicker[securityName]];

            var s = new security(thisSecurityData);
            var tableRow = renderSecurityRow(s);
            rowsToAdd += tableRow;
        }
    });

    // Clear and redraw the table
    clearSearchTable();

    tableHeader = renderSecurityTableHeader();
    appendTableHeader(tableHeader);
    hasHeader = true;
    appendTableBody(rowsToAdd);
}
