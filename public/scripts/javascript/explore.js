// Global variables
var NUM_COLS = 4;
var sectorTable = $('#sectors');
var industryTable = $('#industries');
var companyTable = $('#companies');
var biographicalData;
var technicalData;
var industryToTickersMapData;
var technicalMapData;

$(function() {
    $("#companies").tablesorter();
    // $.get("/biographical", function(data) {
    //     biographicalData = data;
    //     $.get("/technical", function(data) {
    //         technicalData = data; 
    //             $.get("/industry_to_tickers_map", function(data) {
    //                 industryToTickersMapData = data;   
    //                 $.get("/technical_map", function(data) {
    //                     technicalMapData = data;
    //                     renderSectors(biographicalData);
    //                 });
    //             });
           
    //     });
    // });
});

/*
* SECTORS
*/
function renderSectors(data) {
    //var data = biographical;
    var listOfSectors = [];


    sectorTable = $('#sectors');
    
    $('#sectors tr').remove();
    industryTable = $('#industries');
    companyTable = $('#companies');

    // Set the page tutle
    //$('#tableTitle').text("Market Sectors");
    $('#crumbSpace1').hide();
    $('#sectorCrumb').hide();
    $('#crumbSpace2').hide();
    $('#industryCrumb').hide();

    sectorTable.show();
    industryTable.hide();
    companyTable.hide();  

    // Step 0: clear any previous info in the table
    // sectorTable.find("tr:gt(0)").remove();

    // Step 1: find sectors from json file. Because they repeat, use set to remove duplicates
    listOfSectors = Object.keys(data);

    // Step 2: extract sectors only from each json object
    // for (var i = 0; i < listOfSectors.length; i++) {
    //     uniqueSectors.push(listOfSectors[i]['sector']);
    // }

    // Step 3: Generate hash URLS
    // urlSectors = generateHashURL(uniqueSectors); 

    // Step 4: Populate sectors table on home page with their respective hash URLS.
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
        console.log("string: " +rowString);
        rowString += "</tr>";
        sectorTable.append(rowString);
    }

    // Step 5: handle click event. When user clicks on one of sectors on table...
}

function clickSector(sector) {
	// var nameOfSector = $(this).text();

    var nameOfSector = sector.text;

    // ...add breadcrumbs with links
    $('#crumbSpace1').show();
    $('#sectorCrumb').show();
    $('#sectorCrumb').html(nameOfSector);

    var marketLink = '<a href=' + window.location.hash + '>' + 'Market' + '</a>';
    $('#marketCrumb').html(marketLink);

    // ...hide the sector table so that industry table can be placed where it was
    sectorTable.hide();
    industryTable.show();
    companyTable.hide();  

    // ...update hash in URL (for SPA - Single Page App - purposes)
    window.location.hash = $(this).attr('href');

    renderIndustries(nameOfSector);
}

function createSectorTD(sectorNames, index) {
    var tdString = "<td class='hoverable'>";
    tdString += "<a class='spaLinks hoverlink' onclick='clickSector(this)'>" + sectorNames[index] + "</a></td>";
    return tdString;
}

/*
* INDUSTRIES
*/
function renderIndustries(data, sector) {
    var sectorName = sector;
    //var data = biographical;
    var matchingSectors = [];
    var uniqueIndustries = [];
    var listOfUniqueIndustries = [];

    // Step 0: clear any previous info in the table
    industryTable.find("tr:gt(0)").remove();

    // Step 1: find matching sectors from biographical.json
    for (var i = 0; i < data.length; i++) {
        if (sectorName == data[i]['sector'] && !(sectorName in matchingSectors)) { // if sector names match and not already in a list of cells
            matchingSectors.push(data[i]);
        }
    }
  
    // Step 2: there can be repeating industries from list of matching sectors, so consider duplicate industries only once
    uniqueIndustries = matchingSectors.filter((set => f => !set.has(f.industry) && set.add(f.industry))(new Set));

    // Step 3: extract only industries from each
    for (var i = 0; i < uniqueIndustries.length; i++) {
        listOfUniqueIndustries.push(uniqueIndustries[i]['industry']);
    }

    // Step 4: create array from stringified JSON object
    // Before splitting string, listOfUniqueIndustries[0] returns [, [1] returns ", and [2] returns H
    JSON.stringify(listOfUniqueIndustries).split(',');
    // After splitting, listOfUniqueIndustries[0] returns "Health Care Equipment" and [1] returns "Pharmaceuticals" ... which is what we want.

    // Step 5: construct industry table
    var numRows = Math.ceil(listOfUniqueIndustries.length / NUM_COLS);
    var urlIndustries = generateHashURL(listOfUniqueIndustries); 
    var index = 0;

    var stringToAppend = "";
        for (var i = 0; i < numRows; i++) {
            stringToAppend = stringToAppend + "<tr>";
            for (var j = 0; j < NUM_COLS; j++) {
                if (index < listOfUniqueIndustries.length) {
                    stringToAppend = stringToAppend + "<td class='hoverable'><a href='" + urlIndustries[index] + "' class='spaLinks hoverlink'>" + listOfUniqueIndustries[index] + "</a></td>";
                    index++;
                }      
            }
        stringToAppend = stringToAppend + "</tr>";
    }
  
    industryTable.append(stringToAppend);

    // When user clicks on one of industries on table...
    // $('.spaLinks').click( function(e) {
    //     e.preventDefault(); 
    //     // ...replace heading with user-clicked sector
    //     var nameOfIndustry = $(this).text();
    //     //$('#tableTitle').text($(this).text());

    //     // ...change breadcrumbs
    //     $('#crumbSpace2').show();
    //     $('#industryCrumb').show();
    //     $('#industryCrumb').text(nameOfIndustry);

    //     var sectorLink = '<a href=' + window.location.hash + '>' + sectorName + '</a>';
    //     $('#sectorCrumb').html(sectorLink);

    //     // ...hide the sector table so that industry table can be placed where it was
    //     sectorTable.hide();
    //     industryTable.hide();
    //     companyTable.show();  

    //     // ...update hash in URL (for SPA - Single Page App - purposes)
    //     window.location.hash = $(this).attr('href');

    //     //function clickIndustry() {
    //         renderCompanies(biographicalData, technicalData, nameOfIndustry, sectorName);
    //     //}

    // });
}

/*
* COMPANIES
*/
function renderCompanies(biographicaljson, technicaljson, industryName, sectorName) {

    var industry = industryName;
    var listOfTickersToCreateRows = [];

    // Construct companies table
    var companyTableBody = $("#companies tbody"); 
    companyTableBody.find("tr:gt(-1)").remove();

    listOfTickersToCreateRows = industryToTickersMapData[industry];

    for (var index = 0; index < listOfTickersToCreateRows.length; index++) {
        companyTableBody.append(createRowString(technicalMapData[listOfTickersToCreateRows[index]], index));
        $("#companies").trigger("update");
    }
    
    // When user clicks on one of industries on table...
    $('#sectorCrumb').click( function(e) {
        e.preventDefault(); 

        // ...replace heading with user-clicked sector
        //$('#tableTitle').text(sectorName);

        $('#sectorCrumb').html(sectorName);

        $('#industryCrumb').html('Industry');
        $('#industryCrumb').hide();
        $('#crumbSpace2').hide();

        // ...hide the sector table so that industry table can be placed where it was
        sectorTable.hide();
        industryTable.show();
        companyTable.hide();  
        
        // ...update hash in URL (for SPA - Single Page App - purposes)
        var newHash = '\#' + sectorName.toLowerCase();
        window.location.hash = newHash;
        //renderIndustries(biographical, sectorName);
    });

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

// Function to display tooltips
function displayToolTip(event, popup) {
    if(event.which == 3) {
        popup.toggleClass('show');
        event.stopPropagation();
    }
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

// GENERATING HASH URL
function generateHashURL(list) {
    var hashURL = [];
    for (var i = 0; i < list.length; i ++) {
        hashURL.push("#" + list[i].replace(/\s+/g, '-').toLowerCase());
    }
    return hashURL;
}

function hello() {
	alert("hi from explore");
}

// Delete hashes upon page reload/refresh
if (window.performance) {
    window.location.hash = "";
}