$(function() {
  renderSector(biographical);
});

/*
*
*
*** SECTORS
*
*
*/
function renderSector(data) {
  var data = biographical;
  var listOfSectors = [];
  var uniqueSectors = [];
  var urlSectors = [];
  var sectorTable = $('#sector');
  var industryTable = $('#industry');
  var companyTable = $('#company');

  sectorTable.show();
  industryTable.hide();
  companyTable.hide();  

  // Step 1: find sectors from json file. Because they repeat, use set to remove duplicates
  //
  listOfSectors = data.filter((set => f => !set.has(f.sector) && set.add(f.sector))(new Set));

  // Step 2: extract sectors only from each json object
  //
  for (var i = 0; i < listOfSectors.length; i++) {
     uniqueSectors.push(listOfSectors[i]['sector']);
  }

  // Step 3: Generate hash URLS
  //
  urlSectors = generateHashURL(uniqueSectors); 

  // Step 4: Populate sectors table on home page with their respective hash URLS.
  //
  sectorTable.append(
    '<tr><td><a href="' + urlSectors[0] + '">' + uniqueSectors[0] + '</a>' + 
    '</td><td><a href="' + urlSectors[1] + '">' + uniqueSectors[1] + '</a>' + 
    '</td><td><a href="' + urlSectors[2] + '">' + uniqueSectors[2] + '</a>' + 
    '</td><td><a href="' + urlSectors[3] + '">' + uniqueSectors[3] + '</a>' + 
    '</td></tr>' +
    
    '<tr><td><a href="' + urlSectors[4] + '">' + uniqueSectors[4] + '</a>' +
    '</td><td><a href="' + urlSectors[5] + '">' + uniqueSectors[5] + '</a>' +
    '</td><td><a href="' + urlSectors[6] + '">' + uniqueSectors[6] + '</a>' +
    '</td><td><a href="' + urlSectors[7] + '">' + uniqueSectors[7] + '</a>' +
    '</td></tr>' + 

    '<tr><td><a href="' + urlSectors[8] + '">' + uniqueSectors[8] + '</a>' +
    '</td><td><a href="' + urlSectors[9] + '">' + uniqueSectors[9] + '</a>' +
    '</td><td>' + 
    " " + '</td><td>' + 
    " " + '</td></tr>'
  );

  // Step 5: handle click event. When user clicks on one of sectors on table...
  $('a').click( function(e) {
    // ...we're staying in the same page even after reload
    e.preventDefault(); 

    // ...replace heading with user-clicked sector
    var nameOfSector = $(this).text();
    $('h2').text($(this).text());

    // ...hide the sector table so that industry table can be placed where it was
      sectorTable.hide();
      industryTable.show();
      companyTable.hide();  

    // ...update hash in URL (for SPA - Single Page App - purposes)
    window.location.hash = $(this).attr('href');
    renderIndustry(biographical, nameOfSector);
  });

}

/*
*
*
*** INDUSTRIES
*
*
*/
function renderIndustry(data, sector) {
  var sectorName = sector;
  var data = biographical;
  var matchingSectors = [];
  var uniqueIndustries = [];
  var listOfUniqueIndustries = [];

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
  // After splitting, listOfUniqueIndustries[0] returns "Health Care Equipment" and [1] returns "Pharmaceuticals" ... which is what we want!

  // Step 5: construct industry table
  var sectorTable = $('#sector');
  var industryTable = $('#industry');
  var companyTable = $('#company');
  var numCol = 4; // limiting to 4 cols for visual aesthetics
  var numRow = Math.ceil(listOfUniqueIndustries.length / 4);
  var urlIndustries = generateHashURL(listOfUniqueIndustries); 
  var index = 0;

  var stringToAppend = "";
  for (var i = 0; i < numRow; i++) {
    stringToAppend = stringToAppend + "<tr>";
    for (var j = 0; j < numCol; j++) {
      
      stringToAppend = stringToAppend + "<td><a href='" + urlIndustries[index] + "' class = 'aIndustry'>" + listOfUniqueIndustries[index] + "</a></td>";
      index++;
      
    }
    stringToAppend = stringToAppend + "</tr>";
  }
  
  industryTable.append(stringToAppend);

  // When user clicks on one of industries on table...
  $('a.aIndustry').click( function(e) {
    e.preventDefault(); 
    // ...replace heading with user-clicked sector
    var nameOfIndustry = $(this).text();
    $('h2').text($(this).text());

    // ...hide the sector table so that industry table can be placed where it was
     sectorTable.hide();
     industryTable.hide();
     companyTable.show();  

    // ...update hash in URL (for SPA - Single Page App - purposes)
    window.location.hash = $(this).attr('href');
    renderCompany(biographical, technical, nameOfIndustry);
    });
  }
/*
*
*
*** COMPANIES
*
*
*/
function renderCompany(biographicaljson, technicaljson, industryName) {

  var industry = industryName;

  // Construct company table
  var companyTable = $("#company"); 

  for (var index = 0; index < electricUtilities.length; index++) {
    console.log("companyname = " + electricUtilities[index]['company_name']);

    companyTable.append(createRowString(electricUtilities, index));
  }
  return false; 
}


function createRowString(companyInfo, index) {
    var rowString = "<tr>";

    rowString += "<td class='black'>" + companyInfo[index]['company_name'] + "</td>";
    rowString += createTDString(companyInfo[index]["pe_cur"], companyInfo[index]["pe_avg"]);
    rowString += createTDString(companyInfo[index]["ps_cur"], companyInfo[index]["ps_avg"]);
    rowString += createTDString(companyInfo[index]["pb_cur"], companyInfo[index]["pb_avg"]);
    rowString += createTDString(companyInfo[index]["div_cur"], companyInfo[index]["div_avg"]);
    rowString += "<td class='black'>" + companyInfo[index]['s_rank'] + "</td>";

    rowString += "</tr>";
    return rowString;
}

function createTDString(currValue, histValue) {
    var currValueNum = parseFloat(currValue);
    var histValueNum = parseFloat(histValue);

    var percent = (currValueNum-histValueNum)/histValueNum;

    if(percent >= 0.25) {
        color = "brightgreen";
    }
    else if(percent <= -0.25) {
        color = "brightred";
    }
    else if(percent < 0.25 && percent >= 0.10){
        color = "darkgreen";
    }
    else if(percent > -0.25 && percent <= -0.10){
        color = "darkred";
    }
    else {
        color = "black";
    }

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

// Delete hashes upon page reload/refresh
if (window.performance) {
  window.location.hash = "";
}

// Sector -> industry -> company

// color = ([pe or ps or div]_avg - [pe or ps or div]_curr) / ([pe or ps or div]_std)

// -2 bright green, -1 green // 0 black // +1 red, +2 bright red

// pe, ps, pb = +1, +2 red; -1, -2 green

// div = +1, +2 green; -1, -2 red
