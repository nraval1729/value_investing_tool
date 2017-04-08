$(document).ready(function() {
  $("#company").tablesorter();

  console.log("will be able to sort company table");
  sector(biographical);
});

/*
*
*
*** SECTORS
*
*
*/
function sector(data) {
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
    industry(biographical, nameOfSector);
  });

}

/*
*
*
*** INDUSTRIES
*
*
*/
function industry(data, sector) {
  var sectorName = sector;
  var data = biographical;
  var matchingSectors = [];
  var uniqueIndustries = [];
  var listOfUniqueIndustries = [];

  // Step 1: find matching sectors from biographical.json
  // For example:
  // If user selects "Health Care" from the list of sectors, any biographical.json object that has "Health Care" as sector will be pushed into matchingSectors array.
  //[
  // {
  //     "ticker": "A", 
  //     "security": "Agilent Technologies Inc", 
  //     "sector": "Health Care", 
  //     "industry": "Health Care Equipment"
  // },  ---> this whole object in {} will be pushed into matchingSectors array.
  // ...
  //]
  for (var i = 0; i < data.length; i++) {
    if (sectorName == data[i]['sector'] && !(sectorName in matchingSectors)) { // if sector names match and not already in a list of cells
      matchingSectors.push(data[i]);
    }
  }
  
  // Step 2: there can be repeating industries from list of matching sectors, so consider duplicate industries only once
  // For example:
  //[
  // {
  //     "ticker": "A", 
  //     "security": "Agilent Technologies Inc", 
  //     "sector": "Health Care", 
  //     "industry": "Health Care Equipment"
  // }, 
  // {
  //     "ticker": "ABT", 
  //     "security": "Abbott Laboratories", 
  //     "sector": "Health Care", 
  //     "industry": "Health Care Equipment"
  // }, 
  // ...
  //] --> both objects identify their industries as "Health Care Equipment", so count that only once and put it in uniqueIndustries array
  uniqueIndustries = matchingSectors.filter((set => f => !set.has(f.industry) && set.add(f.industry))(new Set));

  // Step 3: extract only industries from each
  //[
  // {
  //     "ticker": "A", 
  //     "security": "Agilent Technologies Inc", 
  //     "sector": "Health Care", 
  //     "industry": "Health Care Equipment"
  // }, 
  // {
  //     "ticker": "ABBV", 
  //     "security": "AbbVie", 
  //     "sector": "Health Care", 
  //     "industry": "Pharmaceuticals"
  // }, 
  // ...
  //] --> we don't need each object in their entirety; rather, we only need their industry extracted so that it results in sth like...
  // ["Health Care Equipment", "Pharmaceuticals", ...] --> this is listOfUniqueIndustries.
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

      //industryTable.append("<td><a href='" + urlIndustries[index] + "' class = 'aIndustry'>" + listOfUniqueIndustries[index] + '</a></td>');
      //$('a:contains("undefined")').remove(); // delete any excess empty links that come out as "undefined"
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
    company(biographical, technical, nameOfIndustry);
    });
  }
/*
*
*
*** COMPANIES
*
*
*/
function company(biographicaljson, technicaljson, industryName) {
  var industry = industryName;
  var biographical = biographicaljson;
  var matchingIndustries = [];
  var uniqueCompanies = [];
  var listOfUniqueCompanies = [];
  var listOfTickers = [];

  // Step 1: find all companies that match to their respective industry
  //
  for (var i = 0; i < biographical.length; i++) {
    if (industry == biographical[i]['industry'] && !(industry in matchingIndustries)) { // if industry names match and not already in a list of cells
      matchingIndustries.push(biographical[i]);
    }
  }

  // Step 2: remove duplicate companies
  //
  uniqueCompanies = matchingIndustries.filter((set => f => !set.has(f.security) && set.add(f.security))(new Set));

  // Step 3: extract only company name from the list of json objects
  //
  for (var i = 0; i < uniqueCompanies.length; i++) {
    listOfUniqueCompanies.push(uniqueCompanies[i]['security']);
  }

  // Step 4: format each JSON string to array separated by commas
  JSON.stringify(listOfUniqueCompanies).split(',');

  // Step 5: Construct a list of corresponding tickers for each company name in array
  for (var i = 0; i < listOfUniqueCompanies.length; i++) {
    if (listOfUniqueCompanies[i] == uniqueCompanies[i]['security']) {
      listOfTickers.push(uniqueCompanies[i]['ticker']);
    }
  }

  // Step 6: format each JSON string to array separated by commas
  JSON.stringify(listOfTickers).split(','); // This is splitted

  // Step 7: store length of listOfTickers for reference later
  var numListOfTickers = listOfTickers.length;

  var technical = technicaljson;
  var pe_cur = [];
  var pe_avg = [];
  var ps_cur = [];
  var ps_avg = [];
  var pb_cur = [];
  var pb_avg = [];
  var div_cur = [];
  var div_avg = [];
  var s_rank = [];
  var matchingTickers = [];

  // Since technical.json does not have company name listed, use list of tickers
  for (var x = 0; x < numListOfTickers; x++) {
    for (var y = 0; y < technical.length; y++) {
      if (listOfTickers[x] == technical[y]['ticker']) {
        matchingTickers.push(technical[y]);
      }
    }
  }
  JSON.stringify(matchingTickers).split(',');

  // Store values of current and historical.
  for (var i = 0; i < matchingTickers.length; i++) {
    pe_cur.push(matchingTickers[i]['pe_cur']);
    pe_avg.push(matchingTickers[i]['pe_avg']);

    ps_cur.push(matchingTickers[i]['ps_cur']);
    ps_avg.push(matchingTickers[i]['ps_avg']);

    pb_cur.push(matchingTickers[i]['pb_cur']);
    pb_avg.push(matchingTickers[i]['pb_avg']);

    div_cur.push(matchingTickers[i]['div_cur']);
    div_avg.push(matchingTickers[i]['div_avg']);

    s_rank.push(matchingTickers[i]['s_rank']);
  }

  // Construct company table
  var companyTable = $("#company tbody");

  for (var index = 0; index < listOfUniqueCompanies.length; index++) {

    companyTable.append(
      '<tr><td>' + listOfUniqueCompanies[index] + '</td>' + 
      '<td>' + pe_cur[index] + '</td>' + 
      '<td>' + ps_cur[index] + '</td>' + 
      '<td>' + pb_cur[index] + '</td>' + 
      '<td>' + div_cur[index] + '</td>' + 
      '<td>' + s_rank[index] + '</td>' +
      '</tr>');
    $("#company").trigger("update");
    $('tr:contains("undefined")').remove(); // delete any excess empty links that come out as "undefined"
  }
  return false; 
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
