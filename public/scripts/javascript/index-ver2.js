$(function() {
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
  var industryTable = $("#industry");
  var numCol = 4; // limiting to 4 cols for visual aesthetics
  var numRow = Math.ceil(listOfUniqueIndustries.length / 4);
  var urlIndustries = generateHashURL(listOfUniqueIndustries); 
  var index = 0;

  for (var i = 0; i < numRow; i++) {
    industryTable.append('<tr>');
    for (var j = 0; j < numCol; j++) {
      industryTable.append('<td>');
      industryTable.append("<a href='" + urlIndustries[index] + "' class = 'aIndustry'>" + listOfUniqueIndustries[index] + '</a>');
      $('a:contains("undefined")').remove(); // delete any excess empty links that come out as "undefined"
      index++;
      industryTable.append('</td>');
    }
    industryTable.append('</tr>');
  }
  
  // When user clicks on one of industries on table...
  $('a.aIndustry').click( function(e) {
    e.preventDefault(); 
    // ...replace heading with user-clicked sector
    var nameOfIndustry = $(this).text();
    $('h2').text($(this).text());

    // ...hide the sector table so that industry table can be placed where it was
    industryTable.hide();

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
  var companyTable = $("#company");

  for (var index = 0; index < listOfUniqueCompanies.length; index++) {

    companyTable.append(
      '<tr><td>' + listOfUniqueCompanies[index] + '</td>' + 
      '<td>' + pe_cur[index] + '</td>' + 
      '<td>' + ps_cur[index] + '</td>' + 
      '<td>' + pb_cur[index] + '</td>' + 
      '<td>' + div_cur[index] + '</td>' + 
      '<td>' + s_rank[index] + '</td>' +
      '</tr>');
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

var biographical = [
    {
        "ticker": "A", 
        "security": "Agilent Technologies Inc", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "AAL", 
        "security": "American Airlines Group", 
        "sector": "Industrials", 
        "industry": "Airlines"
    }, 
    {
        "ticker": "AAP", 
        "security": "Advance Auto Parts", 
        "sector": "Consumer Discretionary", 
        "industry": "Automotive Retail"
    }, 
    {
        "ticker": "AAPL", 
        "security": "Apple Inc.", 
        "sector": "Information Technology", 
        "industry": "Technology Hardware, Storage & Peripherals"
    }, 
    {
        "ticker": "ABBV", 
        "security": "AbbVie", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "ABC", 
        "security": "AmerisourceBergen Corp", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "ABT", 
        "security": "Abbott Laboratories", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "ACN", 
        "security": "Accenture plc", 
        "sector": "Information Technology", 
        "industry": "IT Consulting & Other Services"
    }, 
    {
        "ticker": "ADBE", 
        "security": "Adobe Systems Inc", 
        "sector": "Information Technology", 
        "industry": "Application Software"
    }, 
    {
        "ticker": "ADI", 
        "security": "Analog Devices, Inc.", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "ADM", 
        "security": "Archer-Daniels-Midland Co", 
        "sector": "Consumer Staples", 
        "industry": "Agricultural Products"
    }, 
    {
        "ticker": "ADP", 
        "security": "Automatic Data Processing", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "ADS", 
        "security": "Alliance Data Systems", 
        "sector": "Information Technology", 
        "industry": "Data Processing & Outsourced Services"
    }, 
    {
        "ticker": "ADSK", 
        "security": "Autodesk Inc", 
        "sector": "Information Technology", 
        "industry": "Application Software"
    }, 
    {
        "ticker": "AEE", 
        "security": "Ameren Corp", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "AEP", 
        "security": "American Electric Power", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "AES", 
        "security": "AES Corp", 
        "sector": "Utilities", 
        "industry": "Independent Power Producers & Energy Traders"
    }, 
    {
        "ticker": "AET", 
        "security": "Aetna Inc", 
        "sector": "Health Care", 
        "industry": "Managed Health Care"
    }, 
    {
        "ticker": "AFL", 
        "security": "AFLAC Inc", 
        "sector": "Financials", 
        "industry": "Life & Health Insurance"
    }, 
    {
        "ticker": "AGN", 
        "security": "Allergan, Plc", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "AIG", 
        "security": "American International Group, Inc.", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "AIV", 
        "security": "Apartment Investment & Management", 
        "sector": "Real Estate", 
        "industry": "Residential REITs"
    }, 
    {
        "ticker": "AIZ", 
        "security": "Assurant Inc", 
        "sector": "Financials", 
        "industry": "Multi-line Insurance"
    }, 
    {
        "ticker": "AJG", 
        "security": "Arthur J. Gallagher & Co.", 
        "sector": "Financials", 
        "industry": "Insurance Brokers"
    }, 
    {
        "ticker": "AKAM", 
        "security": "Akamai Technologies Inc", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "ALB", 
        "security": "Albemarle Corp", 
        "sector": "Materials", 
        "industry": "Specialty Chemicals"
    }, 
    {
        "ticker": "ALK", 
        "security": "Alaska Air Group Inc", 
        "sector": "Industrials", 
        "industry": "Airlines"
    }, 
    {
        "ticker": "ALL", 
        "security": "Allstate Corp", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "ALLE", 
        "security": "Allegion", 
        "sector": "Industrials", 
        "industry": "Building Products"
    }, 
    {
        "ticker": "ALXN", 
        "security": "Alexion Pharmaceuticals", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "AMAT", 
        "security": "Applied Materials Inc", 
        "sector": "Information Technology", 
        "industry": "Semiconductor Equipment"
    }, 
    {
        "ticker": "AMD", 
        "security": "Advanced Micro Devices Inc", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "AME", 
        "security": "AMETEK Inc", 
        "sector": "Industrials", 
        "industry": "Electrical Components & Equipment"
    }, 
    {
        "ticker": "AMG", 
        "security": "Affiliated Managers Group Inc", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "AMGN", 
        "security": "Amgen Inc", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "AMP", 
        "security": "Ameriprise Financial", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "AMT", 
        "security": "American Tower Corp A", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "AMZN", 
        "security": "Amazon.com Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Internet & Direct Marketing Retail"
    }, 
    {
        "ticker": "AN", 
        "security": "AutoNation Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "ANTM", 
        "security": "Anthem Inc.", 
        "sector": "Health Care", 
        "industry": "Managed Health Care"
    }, 
    {
        "ticker": "AON", 
        "security": "Aon plc", 
        "sector": "Financials", 
        "industry": "Insurance Brokers"
    }, 
    {
        "ticker": "APA", 
        "security": "Apache Corporation", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "APC", 
        "security": "Anadarko Petroleum Corp", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "APD", 
        "security": "Air Products & Chemicals Inc", 
        "sector": "Materials", 
        "industry": "Industrial Gases"
    }, 
    {
        "ticker": "APH", 
        "security": "Amphenol Corp", 
        "sector": "Information Technology", 
        "industry": "Electronic Components"
    }, 
    {
        "ticker": "ARE", 
        "security": "Alexandria Real Estate Equities Inc", 
        "sector": "Real Estate", 
        "industry": "Office REITs"
    }, 
    {
        "ticker": "ARNC", 
        "security": "Arconic Inc", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "ATVI", 
        "security": "Activision Blizzard", 
        "sector": "Information Technology", 
        "industry": "Home Entertainment Software"
    }, 
    {
        "ticker": "AVB", 
        "security": "AvalonBay Communities, Inc.", 
        "sector": "Real Estate", 
        "industry": "Residential REITs"
    }, 
    {
        "ticker": "AVGO", 
        "security": "Broadcom", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "AVY", 
        "security": "Avery Dennison Corp", 
        "sector": "Materials", 
        "industry": "Paper Packaging"
    }, 
    {
        "ticker": "AWK", 
        "security": "American Water Works Company Inc", 
        "sector": "Utilities", 
        "industry": "Water Utilities"
    }, 
    {
        "ticker": "AXP", 
        "security": "American Express Co", 
        "sector": "Financials", 
        "industry": "Consumer Finance"
    }, 
    {
        "ticker": "AYI", 
        "security": "Acuity Brands Inc", 
        "sector": "Industrials", 
        "industry": "Electrical Components & Equipment"
    }, 
    {
        "ticker": "AZO", 
        "security": "AutoZone Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "BA", 
        "security": "Boeing Company", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "BAC", 
        "security": "Bank of America Corp", 
        "sector": "Financials", 
        "industry": "Diversified Banks"
    }, 
    {
        "ticker": "BAX", 
        "security": "Baxter International Inc.", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "BBBY", 
        "security": "Bed Bath & Beyond", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "BBT", 
        "security": "BB&T Corporation", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "BBY", 
        "security": "Best Buy Co. Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Computer & Electronics Retail"
    }, 
    {
        "ticker": "BCR", 
        "security": "Bard (C.R.) Inc.", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "BDX", 
        "security": "Becton Dickinson", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "BEN", 
        "security": "Franklin Resources", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "BF.B", 
        "security": "Brown-Forman Corp.", 
        "sector": "Consumer Staples", 
        "industry": "Distillers & Vintners"
    }, 
    {
        "ticker": "BHI", 
        "security": "Baker Hughes Inc", 
        "sector": "Energy", 
        "industry": "Oil & Gas Equipment & Services"
    }, 
    {
        "ticker": "BIIB", 
        "security": "BIOGEN IDEC Inc.", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "BK", 
        "security": "The Bank of New York Mellon Corp.", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "BLK", 
        "security": "BlackRock", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "BLL", 
        "security": "Ball Corp", 
        "sector": "Materials", 
        "industry": "Metal & Glass Containers"
    }, 
    {
        "ticker": "BMY", 
        "security": "Bristol-Myers Squibb", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "BRK.B", 
        "security": "Berkshire Hathaway", 
        "sector": "Financials", 
        "industry": "Multi-Sector Holdings"
    }, 
    {
        "ticker": "BSX", 
        "security": "Boston Scientific", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "BWA", 
        "security": "BorgWarner", 
        "sector": "Consumer Discretionary", 
        "industry": "Auto Parts & Equipment"
    }, 
    {
        "ticker": "BXP", 
        "security": "Boston Properties", 
        "sector": "Real Estate", 
        "industry": "Office REITs"
    }, 
    {
        "ticker": "C", 
        "security": "Citigroup Inc.", 
        "sector": "Financials", 
        "industry": "Diversified Banks"
    }, 
    {
        "ticker": "CA", 
        "security": "CA, Inc.", 
        "sector": "Information Technology", 
        "industry": "Systems Software"
    }, 
    {
        "ticker": "CAG", 
        "security": "ConAgra Foods Inc.", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "CAH", 
        "security": "Cardinal Health Inc.", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "CAT", 
        "security": "Caterpillar Inc.", 
        "sector": "Industrials", 
        "industry": "Construction Machinery & Heavy Trucks"
    }, 
    {
        "ticker": "CB", 
        "security": "Chubb Limited", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "CBG", 
        "security": "CBRE Group", 
        "sector": "Real Estate", 
        "industry": "Real Estate Services"
    }, 
    {
        "ticker": "CBOE", 
        "security": "CBOE Holdings", 
        "sector": "Financials", 
        "industry": "Financial Exchanges & Data"
    }, 
    {
        "ticker": "CBS", 
        "security": "CBS Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Broadcasting"
    }, 
    {
        "ticker": "CCI", 
        "security": "Crown Castle International Corp.", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "CCL", 
        "security": "Carnival Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Hotels, Resorts & Cruise Lines"
    }, 
    {
        "ticker": "CELG", 
        "security": "Celgene Corp.", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "CERN", 
        "security": "Cerner", 
        "sector": "Health Care", 
        "industry": "Health Care Technology"
    }, 
    {
        "ticker": "CF", 
        "security": "CF Industries Holdings Inc", 
        "sector": "Materials", 
        "industry": "Fertilizers & Agricultural Chemicals"
    }, 
    {
        "ticker": "CFG", 
        "security": "Citizens Financial Group", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "CHD", 
        "security": "Church & Dwight", 
        "sector": "Consumer Staples", 
        "industry": "Household Products"
    }, 
    {
        "ticker": "CHK", 
        "security": "Chesapeake Energy", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "CHRW", 
        "security": "C. H. Robinson Worldwide", 
        "sector": "Industrials", 
        "industry": "Air Freight & Logistics"
    }, 
    {
        "ticker": "CHTR", 
        "security": "Charter Communications", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "CI", 
        "security": "CIGNA Corp.", 
        "sector": "Health Care", 
        "industry": "Managed Health Care"
    }, 
    {
        "ticker": "CINF", 
        "security": "Cincinnati Financial", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "CL", 
        "security": "Colgate-Palmolive", 
        "sector": "Consumer Staples", 
        "industry": "Household Products"
    }, 
    {
        "ticker": "CLX", 
        "security": "The Clorox Company", 
        "sector": "Consumer Staples", 
        "industry": "Household Products"
    }, 
    {
        "ticker": "CMA", 
        "security": "Comerica Inc.", 
        "sector": "Financials", 
        "industry": "Diversified Banks"
    }, 
    {
        "ticker": "CMCSA", 
        "security": "Comcast Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "CME", 
        "security": "CME Group Inc.", 
        "sector": "Financials", 
        "industry": "Financial Exchanges & Data"
    }, 
    {
        "ticker": "CMG", 
        "security": "Chipotle Mexican Grill", 
        "sector": "Consumer Discretionary", 
        "industry": "Restaurants"
    }, 
    {
        "ticker": "CMI", 
        "security": "Cummins Inc.", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "CMS", 
        "security": "CMS Energy", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "CNC", 
        "security": "Centene Corporation", 
        "sector": "Health Care", 
        "industry": "Managed Health Care"
    }, 
    {
        "ticker": "CNP", 
        "security": "CenterPoint Energy", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "COF", 
        "security": "Capital One Financial", 
        "sector": "Financials", 
        "industry": "Consumer Finance"
    }, 
    {
        "ticker": "COG", 
        "security": "Cabot Oil & Gas", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "COH", 
        "security": "Coach Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "COL", 
        "security": "Rockwell Collins", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "COO", 
        "security": "The Cooper Companies", 
        "sector": "Health Care", 
        "industry": "Health Care Supplies"
    }, 
    {
        "ticker": "COP", 
        "security": "ConocoPhillips", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "COST", 
        "security": "Costco Co.", 
        "sector": "Consumer Staples", 
        "industry": "Hypermarkets & Super Centers"
    }, 
    {
        "ticker": "COTY", 
        "security": "Coty, Inc", 
        "sector": "Consumer Staples", 
        "industry": "Personal Products"
    }, 
    {
        "ticker": "CPB", 
        "security": "Campbell Soup", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "CRM", 
        "security": "Salesforce.com", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "CSCO", 
        "security": "Cisco Systems", 
        "sector": "Information Technology", 
        "industry": "Communications Equipment"
    }, 
    {
        "ticker": "CSRA", 
        "security": "CSRA Inc.", 
        "sector": "Information Technology", 
        "industry": "IT Consulting & Other Services"
    }, 
    {
        "ticker": "CSX", 
        "security": "CSX Corp.", 
        "sector": "Industrials", 
        "industry": "Railroads"
    }, 
    {
        "ticker": "CTAS", 
        "security": "Cintas Corporation", 
        "sector": "Industrials", 
        "industry": "Diversified Support Services"
    }, 
    {
        "ticker": "CTL", 
        "security": "CenturyLink Inc", 
        "sector": "Telecommunication Services", 
        "industry": "Integrated Telecommunication Services"
    }, 
    {
        "ticker": "CTSH", 
        "security": "Cognizant Technology Solutions", 
        "sector": "Information Technology", 
        "industry": "IT Consulting & Other Services"
    }, 
    {
        "ticker": "CTXS", 
        "security": "Citrix Systems", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "CVS", 
        "security": "CVS Health", 
        "sector": "Consumer Staples", 
        "industry": "Drug Retail"
    }, 
    {
        "ticker": "CVX", 
        "security": "Chevron Corp.", 
        "sector": "Energy", 
        "industry": "Integrated Oil & Gas"
    }, 
    {
        "ticker": "CXO", 
        "security": "Concho Resources", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "D", 
        "security": "Dominion Resources", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "DAL", 
        "security": "Delta Air Lines", 
        "sector": "Industrials", 
        "industry": "Airlines"
    }, 
    {
        "ticker": "DD", 
        "security": "Du Pont (E.I.)", 
        "sector": "Materials", 
        "industry": "Diversified Chemicals"
    }, 
    {
        "ticker": "DE", 
        "security": "Deere & Co.", 
        "sector": "Industrials", 
        "industry": "Agricultural & Farm Machinery"
    }, 
    {
        "ticker": "DFS", 
        "security": "Discover Financial Services", 
        "sector": "Financials", 
        "industry": "Consumer Finance"
    }, 
    {
        "ticker": "DG", 
        "security": "Dollar General", 
        "sector": "Consumer Discretionary", 
        "industry": "General Merchandise Stores"
    }, 
    {
        "ticker": "DGX", 
        "security": "Quest Diagnostics", 
        "sector": "Health Care", 
        "industry": "Health Care Services"
    }, 
    {
        "ticker": "DHI", 
        "security": "D. R. Horton", 
        "sector": "Consumer Discretionary", 
        "industry": "Homebuilding"
    }, 
    {
        "ticker": "DHR", 
        "security": "Danaher Corp.", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "DIS", 
        "security": "The Walt Disney Company", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "DISCA", 
        "security": "Discovery Communications-A", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "DISCK", 
        "security": "Discovery Communications-C", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "DISH", 
        "security": "Dish Network", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "DLPH", 
        "security": "Delphi Automotive", 
        "sector": "Consumer Discretionary", 
        "industry": "Auto Parts & Equipment"
    }, 
    {
        "ticker": "DLR", 
        "security": "Digital Realty Trust", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "DLTR", 
        "security": "Dollar Tree", 
        "sector": "Consumer Discretionary", 
        "industry": "General Merchandise Stores"
    }, 
    {
        "ticker": "DNB", 
        "security": "Dun & Bradstreet", 
        "sector": "Industrials", 
        "industry": "Research & Consulting Services"
    }, 
    {
        "ticker": "DOV", 
        "security": "Dover Corp.", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "DOW", 
        "security": "Dow Chemical", 
        "sector": "Materials", 
        "industry": "Diversified Chemicals"
    }, 
    {
        "ticker": "DPS", 
        "security": "Dr Pepper Snapple Group", 
        "sector": "Consumer Staples", 
        "industry": "Soft Drinks"
    }, 
    {
        "ticker": "DRI", 
        "security": "Darden Restaurants", 
        "sector": "Consumer Discretionary", 
        "industry": "Restaurants"
    }, 
    {
        "ticker": "DTE", 
        "security": "DTE Energy Co.", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "DUK", 
        "security": "Duke Energy", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "DVA", 
        "security": "DaVita Inc.", 
        "sector": "Health Care", 
        "industry": "Health Care Facilities"
    }, 
    {
        "ticker": "DVN", 
        "security": "Devon Energy Corp.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "EA", 
        "security": "Electronic Arts", 
        "sector": "Information Technology", 
        "industry": "Home Entertainment Software"
    }, 
    {
        "ticker": "EBAY", 
        "security": "eBay Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "ECL", 
        "security": "Ecolab Inc.", 
        "sector": "Materials", 
        "industry": "Specialty Chemicals"
    }, 
    {
        "ticker": "ED", 
        "security": "Consolidated Edison", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "EFX", 
        "security": "Equifax Inc.", 
        "sector": "Industrials", 
        "industry": "Research & Consulting Services"
    }, 
    {
        "ticker": "EIX", 
        "security": "Edison Int'l", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "EL", 
        "security": "Estee Lauder Cos.", 
        "sector": "Consumer Staples", 
        "industry": "Personal Products"
    }, 
    {
        "ticker": "EMN", 
        "security": "Eastman Chemical", 
        "sector": "Materials", 
        "industry": "Diversified Chemicals"
    }, 
    {
        "ticker": "EMR", 
        "security": "Emerson Electric Company", 
        "sector": "Industrials", 
        "industry": "Electrical Components & Equipment"
    }, 
    {
        "ticker": "EOG", 
        "security": "EOG Resources", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "EQIX", 
        "security": "Equinix", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "EQR", 
        "security": "Equity Residential", 
        "sector": "Real Estate", 
        "industry": "Residential REITs"
    }, 
    {
        "ticker": "EQT", 
        "security": "EQT Corporation", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "ES", 
        "security": "Eversource Energy", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "ESRX", 
        "security": "Express Scripts", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "ESS", 
        "security": "Essex Property Trust, Inc.", 
        "sector": "Real Estate", 
        "industry": "Residential REITs"
    }, 
    {
        "ticker": "ETFC", 
        "security": "E*Trade", 
        "sector": "Financials", 
        "industry": "Investment Banking & Brokerage"
    }, 
    {
        "ticker": "ETN", 
        "security": "Eaton Corporation", 
        "sector": "Industrials", 
        "industry": "Electrical Components & Equipment"
    }, 
    {
        "ticker": "ETR", 
        "security": "Entergy Corp.", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "EVHC", 
        "security": "Envision Healthcare", 
        "sector": "Health Care", 
        "industry": "Health Care Services"
    }, 
    {
        "ticker": "EW", 
        "security": "Edwards Lifesciences", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "EXC", 
        "security": "Exelon Corp.", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "EXPD", 
        "security": "Expeditors International", 
        "sector": "Industrials", 
        "industry": "Air Freight & Logistics"
    }, 
    {
        "ticker": "EXPE", 
        "security": "Expedia Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Internet & Direct Marketing Retail"
    }, 
    {
        "ticker": "EXR", 
        "security": "Extra Space Storage", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "F", 
        "security": "Ford Motor", 
        "sector": "Consumer Discretionary", 
        "industry": "Automobile Manufacturers"
    }, 
    {
        "ticker": "FAST", 
        "security": "Fastenal Co", 
        "sector": "Industrials", 
        "industry": "Building Products"
    }, 
    {
        "ticker": "FB", 
        "security": "Facebook, Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "FBHS", 
        "security": "Fortune Brands Home & Security", 
        "sector": "Industrials", 
        "industry": "Building Products"
    }, 
    {
        "ticker": "FCX", 
        "security": "Freeport-McMoRan Inc.", 
        "sector": "Materials", 
        "industry": "Copper"
    }, 
    {
        "ticker": "FDX", 
        "security": "FedEx Corporation", 
        "sector": "Industrials", 
        "industry": "Air Freight & Logistics"
    }, 
    {
        "ticker": "FE", 
        "security": "FirstEnergy Corp", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "FFIV", 
        "security": "F5 Networks", 
        "sector": "Information Technology", 
        "industry": "Communications Equipment"
    }, 
    {
        "ticker": "FIS", 
        "security": "Fidelity National Information Services", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "FISV", 
        "security": "Fiserv Inc", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "FITB", 
        "security": "Fifth Third Bancorp", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "FL", 
        "security": "Foot Locker Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel Retail"
    }, 
    {
        "ticker": "FLIR", 
        "security": "FLIR Systems", 
        "sector": "Information Technology", 
        "industry": "Electronic Equipment & Instruments"
    }, 
    {
        "ticker": "FLR", 
        "security": "Fluor Corp.", 
        "sector": "Industrials", 
        "industry": "Construction & Engineering"
    }, 
    {
        "ticker": "FLS", 
        "security": "Flowserve Corporation", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "FMC", 
        "security": "FMC Corporation", 
        "sector": "Materials", 
        "industry": "Fertilizers & Agricultural Chemicals"
    }, 
    {
        "ticker": "FOX", 
        "security": "Twenty-First Century Fox Class B", 
        "sector": "Consumer Discretionary", 
        "industry": "Publishing"
    }, 
    {
        "ticker": "FOXA", 
        "security": "Twenty-First Century Fox Class A", 
        "sector": "Consumer Discretionary", 
        "industry": "Publishing"
    }, 
    {
        "ticker": "FRT", 
        "security": "Federal Realty Investment Trust", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "FTI", 
        "security": "FMC Technologies Inc.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Equipment & Services"
    }, 
    {
        "ticker": "FTV", 
        "security": "Fortive Corp", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "GD", 
        "security": "General Dynamics", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "GE", 
        "security": "General Electric", 
        "sector": "Industrials", 
        "industry": "Industrial Conglomerates"
    }, 
    {
        "ticker": "GGP", 
        "security": "General Growth Properties Inc.", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "GILD", 
        "security": "Gilead Sciences", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "GIS", 
        "security": "General Mills", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "GLW", 
        "security": "Corning Inc.", 
        "sector": "Information Technology", 
        "industry": "Electronic Components"
    }, 
    {
        "ticker": "GM", 
        "security": "General Motors", 
        "sector": "Consumer Discretionary", 
        "industry": "Automobile Manufacturers"
    }, 
    {
        "ticker": "GOOG", 
        "security": "Alphabet Inc Class C", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "GOOGL", 
        "security": "Alphabet Inc Class A", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "GPC", 
        "security": "Genuine Parts", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "GPN", 
        "security": "Global Payments Inc", 
        "sector": "Information Technology", 
        "industry": "Data Processing & Outsourced Services"
    }, 
    {
        "ticker": "GPS", 
        "security": "Gap (The)", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel Retail"
    }, 
    {
        "ticker": "GRMN", 
        "security": "Garmin Ltd.", 
        "sector": "Consumer Discretionary", 
        "industry": "Consumer Electronics"
    }, 
    {
        "ticker": "GS", 
        "security": "Goldman Sachs Group", 
        "sector": "Financials", 
        "industry": "Investment Banking & Brokerage"
    }, 
    {
        "ticker": "GT", 
        "security": "Goodyear Tire & Rubber", 
        "sector": "Consumer Discretionary", 
        "industry": "Tires & Rubber"
    }, 
    {
        "ticker": "GWW", 
        "security": "Grainger (W.W.) Inc.", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "HAL", 
        "security": "Halliburton Co.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Equipment & Services"
    }, 
    {
        "ticker": "HAS", 
        "security": "Hasbro Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Leisure Products"
    }, 
    {
        "ticker": "HBAN", 
        "security": "Huntington Bancshares", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "HBI", 
        "security": "Hanesbrands Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "HCA", 
        "security": "HCA Holdings", 
        "sector": "Health Care", 
        "industry": "Health Care Facilities"
    }, 
    {
        "ticker": "HCN", 
        "security": "Welltower Inc.", 
        "sector": "Real Estate", 
        "industry": "Health Care REITs"
    }, 
    {
        "ticker": "HCP", 
        "security": "HCP Inc.", 
        "sector": "Real Estate", 
        "industry": "Health Care REITs"
    }, 
    {
        "ticker": "HD", 
        "security": "Home Depot", 
        "sector": "Consumer Discretionary", 
        "industry": "Home Improvement Retail"
    }, 
    {
        "ticker": "HES", 
        "security": "Hess Corporation", 
        "sector": "Energy", 
        "industry": "Integrated Oil & Gas"
    }, 
    {
        "ticker": "HIG", 
        "security": "Hartford Financial Svc.Gp.", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "HOG", 
        "security": "Harley-Davidson", 
        "sector": "Consumer Discretionary", 
        "industry": "Motorcycle Manufacturers"
    }, 
    {
        "ticker": "HOLX", 
        "security": "Hologic", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "HON", 
        "security": "Honeywell Int'l Inc.", 
        "sector": "Industrials", 
        "industry": "Industrial Conglomerates"
    }, 
    {
        "ticker": "HP", 
        "security": "Helmerich & Payne", 
        "sector": "Energy", 
        "industry": "Oil & Gas Drilling"
    }, 
    {
        "ticker": "HPE", 
        "security": "Hewlett Packard Enterprise", 
        "sector": "Information Technology", 
        "industry": "Technology Hardware, Storage & Peripherals"
    }, 
    {
        "ticker": "HPQ", 
        "security": "HP Inc.", 
        "sector": "Information Technology", 
        "industry": "Technology Hardware, Storage & Peripherals"
    }, 
    {
        "ticker": "HRB", 
        "security": "Block H&R", 
        "sector": "Financials", 
        "industry": "Consumer Finance"
    }, 
    {
        "ticker": "HRL", 
        "security": "Hormel Foods Corp.", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "HRS", 
        "security": "Harris Corporation", 
        "sector": "Information Technology", 
        "industry": "Communications Equipment"
    }, 
    {
        "ticker": "HSIC", 
        "security": "Henry Schein", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "HST", 
        "security": "Host Hotels & Resorts", 
        "sector": "Real Estate", 
        "industry": "Hotel & Resort REITs"
    }, 
    {
        "ticker": "HSY", 
        "security": "The Hershey Company", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "HUM", 
        "security": "Humana Inc.", 
        "sector": "Health Care", 
        "industry": "Managed Health Care"
    }, 
    {
        "ticker": "IBM", 
        "security": "International Business Machines", 
        "sector": "Information Technology", 
        "industry": "IT Consulting & Other Services"
    }, 
    {
        "ticker": "ICE", 
        "security": "Intercontinental Exchange", 
        "sector": "Financials", 
        "industry": "Financial Exchanges & Data"
    }, 
    {
        "ticker": "IDXX", 
        "security": "IDEXX Laboratories", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "IFF", 
        "security": "Intl Flavors & Fragrances", 
        "sector": "Materials", 
        "industry": "Specialty Chemicals"
    }, 
    {
        "ticker": "ILMN", 
        "security": "Illumina Inc", 
        "sector": "Health Care", 
        "industry": "Life Sciences Tools & Services"
    }, 
    {
        "ticker": "INCY", 
        "security": "Incyte", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "INTC", 
        "security": "Intel Corp.", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "INTU", 
        "security": "Intuit Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "IP", 
        "security": "International Paper", 
        "sector": "Materials", 
        "industry": "Paper Packaging"
    }, 
    {
        "ticker": "IPG", 
        "security": "Interpublic Group", 
        "sector": "Consumer Discretionary", 
        "industry": "Advertising"
    }, 
    {
        "ticker": "IR", 
        "security": "Ingersoll-Rand PLC", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "IRM", 
        "security": "Iron Mountain Incorporated", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "ISRG", 
        "security": "Intuitive Surgical Inc.", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "ITW", 
        "security": "Illinois Tool Works", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "IVZ", 
        "security": "Invesco Ltd.", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "JBHT", 
        "security": "J. B. Hunt Transport Services", 
        "sector": "Industrials", 
        "industry": "Trucking"
    }, 
    {
        "ticker": "JCI", 
        "security": "Johnson Controls International", 
        "sector": "Industrials", 
        "industry": "Building Products"
    }, 
    {
        "ticker": "JEC", 
        "security": "Jacobs Engineering Group", 
        "sector": "Industrials", 
        "industry": "Construction & Engineering"
    }, 
    {
        "ticker": "JNJ", 
        "security": "Johnson & Johnson", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "JNPR", 
        "security": "Juniper Networks", 
        "sector": "Information Technology", 
        "industry": "Communications Equipment"
    }, 
    {
        "ticker": "JPM", 
        "security": "JPMorgan Chase & Co.", 
        "sector": "Financials", 
        "industry": "Diversified Banks"
    }, 
    {
        "ticker": "JWN", 
        "security": "Nordstrom", 
        "sector": "Consumer Discretionary", 
        "industry": "Department Stores"
    }, 
    {
        "ticker": "K", 
        "security": "Kellogg Co.", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "KEY", 
        "security": "KeyCorp", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "KHC", 
        "security": "Kraft Heinz Co", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "KIM", 
        "security": "Kimco Realty", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "KLAC", 
        "security": "KLA-Tencor Corp.", 
        "sector": "Information Technology", 
        "industry": "Semiconductor Equipment"
    }, 
    {
        "ticker": "KMB", 
        "security": "Kimberly-Clark", 
        "sector": "Consumer Staples", 
        "industry": "Household Products"
    }, 
    {
        "ticker": "KMI", 
        "security": "Kinder Morgan", 
        "sector": "Energy", 
        "industry": "Oil & Gas Storage & Transportation"
    }, 
    {
        "ticker": "KMX", 
        "security": "Carmax Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "KO", 
        "security": "Coca Cola Company", 
        "sector": "Consumer Staples", 
        "industry": "Soft Drinks"
    }, 
    {
        "ticker": "KORS", 
        "security": "Michael Kors Holdings", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "KR", 
        "security": "Kroger Co.", 
        "sector": "Consumer Staples", 
        "industry": "Food Retail"
    }, 
    {
        "ticker": "KSS", 
        "security": "Kohl's Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "General Merchandise Stores"
    }, 
    {
        "ticker": "KSU", 
        "security": "Kansas City Southern", 
        "sector": "Industrials", 
        "industry": "Railroads"
    }, 
    {
        "ticker": "L", 
        "security": "Loews Corp.", 
        "sector": "Financials", 
        "industry": "Multi-line Insurance"
    }, 
    {
        "ticker": "LB", 
        "security": "L Brands Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel Retail"
    }, 
    {
        "ticker": "LEG", 
        "security": "Leggett & Platt", 
        "sector": "Consumer Discretionary", 
        "industry": "Home Furnishings"
    }, 
    {
        "ticker": "LEN", 
        "security": "Lennar Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Homebuilding"
    }, 
    {
        "ticker": "LH", 
        "security": "Laboratory Corp. of America Holding", 
        "sector": "Health Care", 
        "industry": "Health Care Services"
    }, 
    {
        "ticker": "LKQ", 
        "security": "LKQ Corporation", 
        "sector": "Consumer Discretionary", 
        "industry": "Distributors"
    }, 
    {
        "ticker": "LLL", 
        "security": "L-3 Communications Holdings", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "LLY", 
        "security": "Lilly (Eli) & Co.", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "LMT", 
        "security": "Lockheed Martin Corp.", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "LNC", 
        "security": "Lincoln National", 
        "sector": "Financials", 
        "industry": "Multi-line Insurance"
    }, 
    {
        "ticker": "LNT", 
        "security": "Alliant Energy Corp", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "LOW", 
        "security": "Lowe's Cos.", 
        "sector": "Consumer Discretionary", 
        "industry": "Home Improvement Retail"
    }, 
    {
        "ticker": "LRCX", 
        "security": "Lam Research", 
        "sector": "Information Technology", 
        "industry": "Semiconductor Equipment"
    }, 
    {
        "ticker": "LUK", 
        "security": "Leucadia National Corp.", 
        "sector": "Financials", 
        "industry": "Multi-Sector Holdings"
    }, 
    {
        "ticker": "LUV", 
        "security": "Southwest Airlines", 
        "sector": "Industrials", 
        "industry": "Airlines"
    }, 
    {
        "ticker": "LVLT", 
        "security": "Level 3 Communications", 
        "sector": "Telecommunication Services", 
        "industry": "Alternative Carriers"
    }, 
    {
        "ticker": "LYB", 
        "security": "LyondellBasell", 
        "sector": "Materials", 
        "industry": "Specialty Chemicals"
    }, 
    {
        "ticker": "M", 
        "security": "Macy's Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Department Stores"
    }, 
    {
        "ticker": "MA", 
        "security": "Mastercard Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "MAA", 
        "security": "Mid-America Apartments", 
        "sector": "Real Estate", 
        "industry": "Residential REITs"
    }, 
    {
        "ticker": "MAC", 
        "security": "Macerich", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "MAR", 
        "security": "Marriott Int'l.", 
        "sector": "Consumer Discretionary", 
        "industry": "Hotels, Resorts & Cruise Lines"
    }, 
    {
        "ticker": "MAS", 
        "security": "Masco Corp.", 
        "sector": "Industrials", 
        "industry": "Building Products"
    }, 
    {
        "ticker": "MAT", 
        "security": "Mattel Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Leisure Products"
    }, 
    {
        "ticker": "MCD", 
        "security": "McDonald's Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Restaurants"
    }, 
    {
        "ticker": "MCHP", 
        "security": "Microchip Technology", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "MCK", 
        "security": "McKesson Corp.", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "MCO", 
        "security": "Moody's Corp", 
        "sector": "Financials", 
        "industry": "Financial Exchanges & Data"
    }, 
    {
        "ticker": "MDLZ", 
        "security": "Mondelez International", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "MDT", 
        "security": "Medtronic plc", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "MET", 
        "security": "MetLife Inc.", 
        "sector": "Financials", 
        "industry": "Life & Health Insurance"
    }, 
    {
        "ticker": "MHK", 
        "security": "Mohawk Industries", 
        "sector": "Consumer Discretionary", 
        "industry": "Home Furnishings"
    }, 
    {
        "ticker": "MJN", 
        "security": "Mead Johnson", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "MKC", 
        "security": "McCormick & Co.", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "MLM", 
        "security": "Martin Marietta Materials", 
        "sector": "Materials", 
        "industry": "Construction Materials"
    }, 
    {
        "ticker": "MMC", 
        "security": "Marsh & McLennan", 
        "sector": "Financials", 
        "industry": "Insurance Brokers"
    }, 
    {
        "ticker": "MMM", 
        "security": "3M Company", 
        "sector": "Industrials", 
        "industry": "Industrial Conglomerates"
    }, 
    {
        "ticker": "MNK", 
        "security": "Mallinckrodt Plc", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "MNST", 
        "security": "Monster Beverage", 
        "sector": "Consumer Staples", 
        "industry": "Soft Drinks"
    }, 
    {
        "ticker": "MO", 
        "security": "Altria Group Inc", 
        "sector": "Consumer Staples", 
        "industry": "Tobacco"
    }, 
    {
        "ticker": "MON", 
        "security": "Monsanto Co.", 
        "sector": "Materials", 
        "industry": "Fertilizers & Agricultural Chemicals"
    }, 
    {
        "ticker": "MOS", 
        "security": "The Mosaic Company", 
        "sector": "Materials", 
        "industry": "Fertilizers & Agricultural Chemicals"
    }, 
    {
        "ticker": "MPC", 
        "security": "Marathon Petroleum", 
        "sector": "Energy", 
        "industry": "Oil & Gas Refining & Marketing"
    }, 
    {
        "ticker": "MRK", 
        "security": "Merck & Co.", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "MRO", 
        "security": "Marathon Oil Corp.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "MS", 
        "security": "Morgan Stanley", 
        "sector": "Financials", 
        "industry": "Investment Banking & Brokerage"
    }, 
    {
        "ticker": "MSFT", 
        "security": "Microsoft Corp.", 
        "sector": "Information Technology", 
        "industry": "Systems Software"
    }, 
    {
        "ticker": "MSI", 
        "security": "Motorola Solutions Inc.", 
        "sector": "Information Technology", 
        "industry": "Communications Equipment"
    }, 
    {
        "ticker": "MTB", 
        "security": "M&T Bank Corp.", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "MTD", 
        "security": "Mettler Toledo", 
        "sector": "Health Care", 
        "industry": "Life Sciences Tools & Services"
    }, 
    {
        "ticker": "MU", 
        "security": "Micron Technology", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "MUR", 
        "security": "Murphy Oil", 
        "sector": "Energy", 
        "industry": "Integrated Oil & Gas"
    }, 
    {
        "ticker": "MYL", 
        "security": "Mylan N.V.", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "NAVI", 
        "security": "Navient", 
        "sector": "Financials", 
        "industry": "Consumer Finance"
    }, 
    {
        "ticker": "NBL", 
        "security": "Noble Energy Inc", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "NDAQ", 
        "security": "Nasdaq, Inc.", 
        "sector": "Financials", 
        "industry": "Financial Exchanges & Data"
    }, 
    {
        "ticker": "NEE", 
        "security": "NextEra Energy", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "NEM", 
        "security": "Newmont Mining Corp. (Hldg. Co.)", 
        "sector": "Materials", 
        "industry": "Gold"
    }, 
    {
        "ticker": "NFLX", 
        "security": "Netflix Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "NFX", 
        "security": "Newfield Exploration Co", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "NI", 
        "security": "NiSource Inc.", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "NKE", 
        "security": "Nike", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "NLSN", 
        "security": "Nielsen Holdings", 
        "sector": "Industrials", 
        "industry": "Research & Consulting Services"
    }, 
    {
        "ticker": "NOC", 
        "security": "Northrop Grumman Corp.", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "NOV", 
        "security": "National Oilwell Varco Inc.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Equipment & Services"
    }, 
    {
        "ticker": "NRG", 
        "security": "NRG Energy", 
        "sector": "Utilities", 
        "industry": "Independent Power Producers & Energy Traders"
    }, 
    {
        "ticker": "NSC", 
        "security": "Norfolk Southern Corp.", 
        "sector": "Industrials", 
        "industry": "Railroads"
    }, 
    {
        "ticker": "NTAP", 
        "security": "NetApp", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "NTRS", 
        "security": "Northern Trust Corp.", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "NUE", 
        "security": "Nucor Corp.", 
        "sector": "Materials", 
        "industry": "Steel"
    }, 
    {
        "ticker": "NVDA", 
        "security": "Nvidia Corporation", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "NWL", 
        "security": "Newell Brands", 
        "sector": "Consumer Discretionary", 
        "industry": "Housewares & Specialties"
    }, 
    {
        "ticker": "NWS", 
        "security": "News Corp. Class B", 
        "sector": "Consumer Discretionary", 
        "industry": "Publishing"
    }, 
    {
        "ticker": "NWSA", 
        "security": "News Corp. Class A", 
        "sector": "Consumer Discretionary", 
        "industry": "Publishing"
    }, 
    {
        "ticker": "O", 
        "security": "Realty Income Corporation", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "OKE", 
        "security": "ONEOK", 
        "sector": "Energy", 
        "industry": "Oil & Gas Storage & Transportation"
    }, 
    {
        "ticker": "OMC", 
        "security": "Omnicom Group", 
        "sector": "Consumer Discretionary", 
        "industry": "Advertising"
    }, 
    {
        "ticker": "ORCL", 
        "security": "Oracle Corp.", 
        "sector": "Information Technology", 
        "industry": "Application Software"
    }, 
    {
        "ticker": "ORLY", 
        "security": "O'Reilly Automotive", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "OXY", 
        "security": "Occidental Petroleum", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "PAYX", 
        "security": "Paychex Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "PBCT", 
        "security": "People's United Financial", 
        "sector": "Financials", 
        "industry": "Thrifts & Mortgage Finance"
    }, 
    {
        "ticker": "PCAR", 
        "security": "PACCAR Inc.", 
        "sector": "Industrials", 
        "industry": "Construction Machinery & Heavy Trucks"
    }, 
    {
        "ticker": "PCG", 
        "security": "PG&E Corp.", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "PCLN", 
        "security": "Priceline.com Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Internet & Direct Marketing Retail"
    }, 
    {
        "ticker": "PDCO", 
        "security": "Patterson Companies", 
        "sector": "Health Care", 
        "industry": "Health Care Supplies"
    }, 
    {
        "ticker": "PEG", 
        "security": "Public Serv. Enterprise Inc.", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "PEP", 
        "security": "PepsiCo Inc.", 
        "sector": "Consumer Staples", 
        "industry": "Soft Drinks"
    }, 
    {
        "ticker": "PFE", 
        "security": "Pfizer Inc.", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "PFG", 
        "security": "Principal Financial Group", 
        "sector": "Financials", 
        "industry": "Life & Health Insurance"
    }, 
    {
        "ticker": "PG", 
        "security": "Procter & Gamble", 
        "sector": "Consumer Staples", 
        "industry": "Personal Products"
    }, 
    {
        "ticker": "PGR", 
        "security": "Progressive Corp.", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "PH", 
        "security": "Parker-Hannifin", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "PHM", 
        "security": "Pulte Homes Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Homebuilding"
    }, 
    {
        "ticker": "PKI", 
        "security": "PerkinElmer", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "PLD", 
        "security": "Prologis", 
        "sector": "Real Estate", 
        "industry": "Industrial REITs"
    }, 
    {
        "ticker": "PM", 
        "security": "Philip Morris International", 
        "sector": "Consumer Staples", 
        "industry": "Tobacco"
    }, 
    {
        "ticker": "PNC", 
        "security": "PNC Financial Services", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "PNR", 
        "security": "Pentair Ltd.", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "PNW", 
        "security": "Pinnacle West Capital", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "PPG", 
        "security": "PPG Industries", 
        "sector": "Materials", 
        "industry": "Specialty Chemicals"
    }, 
    {
        "ticker": "PPL", 
        "security": "PPL Corp.", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "PRGO", 
        "security": "Perrigo", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }, 
    {
        "ticker": "PRU", 
        "security": "Prudential Financial", 
        "sector": "Financials", 
        "industry": "Life & Health Insurance"
    }, 
    {
        "ticker": "PSA", 
        "security": "Public Storage", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "PSX", 
        "security": "Phillips 66", 
        "sector": "Energy", 
        "industry": "Oil & Gas Refining & Marketing"
    }, 
    {
        "ticker": "PVH", 
        "security": "PVH Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "PWR", 
        "security": "Quanta Services Inc.", 
        "sector": "Industrials", 
        "industry": "Construction & Engineering"
    }, 
    {
        "ticker": "PX", 
        "security": "Praxair Inc.", 
        "sector": "Materials", 
        "industry": "Industrial Gases"
    }, 
    {
        "ticker": "PXD", 
        "security": "Pioneer Natural Resources", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "PYPL", 
        "security": "PayPal", 
        "sector": "Information Technology", 
        "industry": "Data Processing & Outsourced Services"
    }, 
    {
        "ticker": "QCOM", 
        "security": "QUALCOMM Inc.", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "QRVO", 
        "security": "Qorvo", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "R", 
        "security": "Ryder System", 
        "sector": "Industrials", 
        "industry": "Trucking"
    }, 
    {
        "ticker": "RAI", 
        "security": "Reynolds American Inc.", 
        "sector": "Consumer Staples", 
        "industry": "Tobacco"
    }, 
    {
        "ticker": "RCL", 
        "security": "Royal Caribbean Cruises Ltd", 
        "sector": "Consumer Discretionary", 
        "industry": "Hotels, Resorts & Cruise Lines"
    }, 
    {
        "ticker": "REG", 
        "security": "Regency Centers Corporation", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "REGN", 
        "security": "Regeneron", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "RF", 
        "security": "Regions Financial Corp.", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "RHI", 
        "security": "Robert Half International", 
        "sector": "Industrials", 
        "industry": "Human Resource & Employment Services"
    }, 
    {
        "ticker": "RHT", 
        "security": "Red Hat Inc.", 
        "sector": "Information Technology", 
        "industry": "Systems Software"
    }, 
    {
        "ticker": "RIG", 
        "security": "Transocean", 
        "sector": "Energy", 
        "industry": "Oil & Gas Drilling"
    }, 
    {
        "ticker": "RJF", 
        "security": "Raymond James Financial Inc.", 
        "sector": "Financials", 
        "industry": "Investment Banking & Brokerage"
    }, 
    {
        "ticker": "RL", 
        "security": "Polo Ralph Lauren Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "ROK", 
        "security": "Rockwell Automation Inc.", 
        "sector": "Industrials", 
        "industry": "Electrical Components & Equipment"
    }, 
    {
        "ticker": "ROP", 
        "security": "Roper Technologies", 
        "sector": "Industrials", 
        "industry": "Industrial Conglomerates"
    }, 
    {
        "ticker": "ROST", 
        "security": "Ross Stores", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel Retail"
    }, 
    {
        "ticker": "RRC", 
        "security": "Range Resources Corp.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "RSG", 
        "security": "Republic Services Inc", 
        "sector": "Industrials", 
        "industry": "Environmental & Facilities Services"
    }, 
    {
        "ticker": "RTN", 
        "security": "Raytheon Co.", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "SBUX", 
        "security": "Starbucks Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Restaurants"
    }, 
    {
        "ticker": "SCG", 
        "security": "SCANA Corp", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "SCHW", 
        "security": "Charles Schwab Corporation", 
        "sector": "Financials", 
        "industry": "Investment Banking & Brokerage"
    }, 
    {
        "ticker": "SEE", 
        "security": "Sealed Air", 
        "sector": "Materials", 
        "industry": "Paper Packaging"
    }, 
    {
        "ticker": "SHW", 
        "security": "Sherwin-Williams", 
        "sector": "Materials", 
        "industry": "Specialty Chemicals"
    }, 
    {
        "ticker": "SIG", 
        "security": "Signet Jewelers", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "SJM", 
        "security": "JM Smucker", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "SLB", 
        "security": "Schlumberger Ltd.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Equipment & Services"
    }, 
    {
        "ticker": "SLG", 
        "security": "SL Green Realty", 
        "sector": "Real Estate", 
        "industry": "Office REITs"
    }, 
    {
        "ticker": "SNA", 
        "security": "Snap-On Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Household Appliances"
    }, 
    {
        "ticker": "SNI", 
        "security": "Scripps Networks Interactive Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "SNPS", 
        "security": "Synopsys Inc.", 
        "sector": "Information Technology", 
        "industry": "Application Software"
    }, 
    {
        "ticker": "SO", 
        "security": "Southern Co.", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "SPG", 
        "security": "Simon Property Group Inc", 
        "sector": "Real Estate", 
        "industry": "Retail REITs"
    }, 
    {
        "ticker": "SPGI", 
        "security": "S&P Global, Inc.", 
        "sector": "Financials", 
        "industry": "Financial Exchanges & Data"
    }, 
    {
        "ticker": "SPLS", 
        "security": "Staples Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "SRCL", 
        "security": "Stericycle Inc", 
        "sector": "Industrials", 
        "industry": "Environmental & Facilities Services"
    }, 
    {
        "ticker": "SRE", 
        "security": "Sempra Energy", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "STI", 
        "security": "SunTrust Banks", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "STT", 
        "security": "State Street Corp.", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "STX", 
        "security": "Seagate Technology", 
        "sector": "Information Technology", 
        "industry": "Technology Hardware, Storage & Peripherals"
    }, 
    {
        "ticker": "STZ", 
        "security": "Constellation Brands", 
        "sector": "Consumer Staples", 
        "industry": "Distillers & Vintners"
    }, 
    {
        "ticker": "SWK", 
        "security": "Stanley Black & Decker", 
        "sector": "Consumer Discretionary", 
        "industry": "Household Appliances"
    }, 
    {
        "ticker": "SWKS", 
        "security": "Skyworks Solutions", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "SYF", 
        "security": "Synchrony Financial", 
        "sector": "Financials", 
        "industry": "Consumer Finance"
    }, 
    {
        "ticker": "SYK", 
        "security": "Stryker Corp.", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "SYMC", 
        "security": "Symantec Corp.", 
        "sector": "Information Technology", 
        "industry": "Application Software"
    }, 
    {
        "ticker": "SYY", 
        "security": "Sysco Corp.", 
        "sector": "Consumer Staples", 
        "industry": "Food Distributors"
    }, 
    {
        "ticker": "T", 
        "security": "AT&T Inc", 
        "sector": "Telecommunication Services", 
        "industry": "Integrated Telecommunication Services"
    }, 
    {
        "ticker": "TAP", 
        "security": "Molson Coors Brewing Company", 
        "sector": "Consumer Staples", 
        "industry": "Brewers"
    }, 
    {
        "ticker": "TDC", 
        "security": "Teradata Corp.", 
        "sector": "Information Technology", 
        "industry": "Application Software"
    }, 
    {
        "ticker": "TDG", 
        "security": "TransDigm Group", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "TEL", 
        "security": "TE Connectivity Ltd.", 
        "sector": "Information Technology", 
        "industry": "Electronic Manufacturing Services"
    }, 
    {
        "ticker": "TGNA", 
        "security": "Tegna, Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Publishing"
    }, 
    {
        "ticker": "TGT", 
        "security": "Target Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "General Merchandise Stores"
    }, 
    {
        "ticker": "TIF", 
        "security": "Tiffany & Co.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "TJX", 
        "security": "TJX Companies Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel Retail"
    }, 
    {
        "ticker": "TMK", 
        "security": "Torchmark Corp.", 
        "sector": "Financials", 
        "industry": "Life & Health Insurance"
    }, 
    {
        "ticker": "TMO", 
        "security": "Thermo Fisher Scientific", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "TRIP", 
        "security": "TripAdvisor", 
        "sector": "Consumer Discretionary", 
        "industry": "Internet & Direct Marketing Retail"
    }, 
    {
        "ticker": "TROW", 
        "security": "T. Rowe Price Group", 
        "sector": "Financials", 
        "industry": "Asset Management & Custody Banks"
    }, 
    {
        "ticker": "TRV", 
        "security": "The Travelers Companies Inc.", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "TSCO", 
        "security": "Tractor Supply Company", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "TSN", 
        "security": "Tyson Foods", 
        "sector": "Consumer Staples", 
        "industry": "Packaged Foods & Meats"
    }, 
    {
        "ticker": "TSO", 
        "security": "Tesoro Petroleum Co.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Refining & Marketing"
    }, 
    {
        "ticker": "TSS", 
        "security": "Total System Services", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "TWX", 
        "security": "Time Warner Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "TXN", 
        "security": "Texas Instruments", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "TXT", 
        "security": "Textron Inc.", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "UA", 
        "security": "Under Armour", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "UAA", 
        "security": "Under Armour", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "UAL", 
        "security": "United Continental Holdings", 
        "sector": "Industrials", 
        "industry": "Airlines"
    }, 
    {
        "ticker": "UDR", 
        "security": "UDR Inc", 
        "sector": "Real Estate", 
        "industry": "Residential REITs"
    }, 
    {
        "ticker": "UHS", 
        "security": "Universal Health Services, Inc.", 
        "sector": "Health Care", 
        "industry": "Health Care Facilities"
    }, 
    {
        "ticker": "ULTA", 
        "security": "Ulta Salon Cosmetics & Fragrance Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Specialty Stores"
    }, 
    {
        "ticker": "UNH", 
        "security": "United Health Group Inc.", 
        "sector": "Health Care", 
        "industry": "Managed Health Care"
    }, 
    {
        "ticker": "UNM", 
        "security": "Unum Group", 
        "sector": "Financials", 
        "industry": "Life & Health Insurance"
    }, 
    {
        "ticker": "UNP", 
        "security": "Union Pacific", 
        "sector": "Industrials", 
        "industry": "Railroads"
    }, 
    {
        "ticker": "UPS", 
        "security": "United Parcel Service", 
        "sector": "Industrials", 
        "industry": "Air Freight & Logistics"
    }, 
    {
        "ticker": "URI", 
        "security": "United Rentals, Inc.", 
        "sector": "Industrials", 
        "industry": "Trading Companies & Distributors"
    }, 
    {
        "ticker": "USB", 
        "security": "U.S. Bancorp", 
        "sector": "Financials", 
        "industry": "Diversified Banks"
    }, 
    {
        "ticker": "UTX", 
        "security": "United Technologies", 
        "sector": "Industrials", 
        "industry": "Aerospace & Defense"
    }, 
    {
        "ticker": "V", 
        "security": "Visa Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "VAR", 
        "security": "Varian Medical Systems", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "VFC", 
        "security": "V.F. Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Apparel, Accessories & Luxury Goods"
    }, 
    {
        "ticker": "VIAB", 
        "security": "Viacom Inc.", 
        "sector": "Consumer Discretionary", 
        "industry": "Cable & Satellite"
    }, 
    {
        "ticker": "VLO", 
        "security": "Valero Energy", 
        "sector": "Energy", 
        "industry": "Oil & Gas Refining & Marketing"
    }, 
    {
        "ticker": "VMC", 
        "security": "Vulcan Materials", 
        "sector": "Materials", 
        "industry": "Construction Materials"
    }, 
    {
        "ticker": "VNO", 
        "security": "Vornado Realty Trust", 
        "sector": "Real Estate", 
        "industry": "Office REITs"
    }, 
    {
        "ticker": "VRSK", 
        "security": "Verisk Analytics", 
        "sector": "Industrials", 
        "industry": "Research & Consulting Services"
    }, 
    {
        "ticker": "VRSN", 
        "security": "Verisign Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "VRTX", 
        "security": "Vertex Pharmaceuticals Inc", 
        "sector": "Health Care", 
        "industry": "Biotechnology"
    }, 
    {
        "ticker": "VTR", 
        "security": "Ventas Inc", 
        "sector": "Real Estate", 
        "industry": "Health Care REITs"
    }, 
    {
        "ticker": "VZ", 
        "security": "Verizon Communications", 
        "sector": "Telecommunication Services", 
        "industry": "Integrated Telecommunication Services"
    }, 
    {
        "ticker": "WAT", 
        "security": "Waters Corporation", 
        "sector": "Health Care", 
        "industry": "Health Care Distributors"
    }, 
    {
        "ticker": "WBA", 
        "security": "Walgreens Boots Alliance", 
        "sector": "Consumer Staples", 
        "industry": "Drug Retail"
    }, 
    {
        "ticker": "WDC", 
        "security": "Western Digital", 
        "sector": "Information Technology", 
        "industry": "Technology Hardware, Storage & Peripherals"
    }, 
    {
        "ticker": "WEC", 
        "security": "Wec Energy Group Inc", 
        "sector": "Utilities", 
        "industry": "Electric Utilities"
    }, 
    {
        "ticker": "WFC", 
        "security": "Wells Fargo", 
        "sector": "Financials", 
        "industry": "Diversified Banks"
    }, 
    {
        "ticker": "WFM", 
        "security": "Whole Foods Market", 
        "sector": "Consumer Staples", 
        "industry": "Food Retail"
    }, 
    {
        "ticker": "WHR", 
        "security": "Whirlpool Corp.", 
        "sector": "Consumer Discretionary", 
        "industry": "Household Appliances"
    }, 
    {
        "ticker": "WLTW", 
        "security": "Willis Towers Watson", 
        "sector": "Financials", 
        "industry": "Insurance Brokers"
    }, 
    {
        "ticker": "WM", 
        "security": "Waste Management Inc.", 
        "sector": "Industrials", 
        "industry": "Environmental & Facilities Services"
    }, 
    {
        "ticker": "WMB", 
        "security": "Williams Cos.", 
        "sector": "Energy", 
        "industry": "Oil & Gas Storage & Transportation"
    }, 
    {
        "ticker": "WMT", 
        "security": "Wal-Mart Stores", 
        "sector": "Consumer Staples", 
        "industry": "Hypermarkets & Super Centers"
    }, 
    {
        "ticker": "WRK", 
        "security": "WestRock Company", 
        "sector": "Materials", 
        "industry": "Paper Packaging"
    }, 
    {
        "ticker": "WU", 
        "security": "Western Union Co", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "WY", 
        "security": "Weyerhaeuser Corp.", 
        "sector": "Real Estate", 
        "industry": "Specialized REITs"
    }, 
    {
        "ticker": "WYN", 
        "security": "Wyndham Worldwide", 
        "sector": "Consumer Discretionary", 
        "industry": "Hotels, Resorts & Cruise Lines"
    }, 
    {
        "ticker": "WYNN", 
        "security": "Wynn Resorts Ltd", 
        "sector": "Consumer Discretionary", 
        "industry": "Casinos & Gaming"
    }, 
    {
        "ticker": "XEC", 
        "security": "Cimarex Energy", 
        "sector": "Energy", 
        "industry": "Oil & Gas Exploration & Production"
    }, 
    {
        "ticker": "XEL", 
        "security": "Xcel Energy Inc", 
        "sector": "Utilities", 
        "industry": "Multi-Utilities"
    }, 
    {
        "ticker": "XL", 
        "security": "XL Capital", 
        "sector": "Financials", 
        "industry": "Property & Casualty Insurance"
    }, 
    {
        "ticker": "XLNX", 
        "security": "Xilinx Inc", 
        "sector": "Information Technology", 
        "industry": "Semiconductors"
    }, 
    {
        "ticker": "XOM", 
        "security": "Exxon Mobil Corp.", 
        "sector": "Energy", 
        "industry": "Integrated Oil & Gas"
    }, 
    {
        "ticker": "XRAY", 
        "security": "Dentsply Sirona", 
        "sector": "Health Care", 
        "industry": "Health Care Supplies"
    }, 
    {
        "ticker": "XRX", 
        "security": "Xerox Corp.", 
        "sector": "Information Technology", 
        "industry": "Technology Hardware, Storage & Peripherals"
    }, 
    {
        "ticker": "XYL", 
        "security": "Xylem Inc.", 
        "sector": "Industrials", 
        "industry": "Industrial Machinery"
    }, 
    {
        "ticker": "YHOO", 
        "security": "Yahoo Inc.", 
        "sector": "Information Technology", 
        "industry": "Internet Software & Services"
    }, 
    {
        "ticker": "YUM", 
        "security": "Yum! Brands Inc", 
        "sector": "Consumer Discretionary", 
        "industry": "Restaurants"
    }, 
    {
        "ticker": "ZBH", 
        "security": "Zimmer Biomet Holdings", 
        "sector": "Health Care", 
        "industry": "Health Care Equipment"
    }, 
    {
        "ticker": "ZION", 
        "security": "Zions Bancorp", 
        "sector": "Financials", 
        "industry": "Regional Banks"
    }, 
    {
        "ticker": "ZTS", 
        "security": "Zoetis", 
        "sector": "Health Care", 
        "industry": "Pharmaceuticals"
    }
]

var technical = [
    {
        "pe_cur": "13.79", 
        "div_avg": "1.3", 
        "pb_avg": "3.7", 
        "s_rank": 306, 
        "div_cur": "1.63", 
        "pb_cur": "3.43", 
        "pe_avg": "15.0", 
        "ps_cur": "2.34", 
        "ticker": "AXP", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "24.21", 
        "div_avg": "0.9", 
        "pb_avg": "8.5", 
        "s_rank": 424, 
        "div_cur": "1.00", 
        "pb_cur": "7.27", 
        "pe_avg": "24.8", 
        "ps_cur": "1.57", 
        "ticker": "JBHT", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "23.31", 
        "div_avg": "2.3", 
        "pb_avg": "18.7", 
        "s_rank": 51, 
        "div_cur": "3.22", 
        "pb_cur": "133.75", 
        "pe_avg": "18.3", 
        "ps_cur": "1.15", 
        "ticker": "BA", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "35.26", 
        "div_avg": "2.4", 
        "pb_avg": "10.3", 
        "s_rank": 319, 
        "div_cur": "2.45", 
        "pb_cur": "11.78", 
        "pe_avg": "20.4", 
        "ps_cur": "2.18", 
        "ticker": "CPB", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "35.38", 
        "div_avg": "1.4", 
        "pb_avg": "16.4", 
        "s_rank": 461, 
        "div_cur": "1.23", 
        "pb_cur": "20.56", 
        "pe_avg": "24.3", 
        "ps_cur": "9.95", 
        "ticker": "CBOE", 
        "ps_avg": "7.4"
    }, 
    {
        "pe_cur": "21.30", 
        "div_avg": "3.6", 
        "pb_avg": "3.6", 
        "s_rank": 266, 
        "div_cur": "2.68", 
        "pb_cur": "5.18", 
        "pe_avg": "29.6", 
        "ps_cur": "1.45", 
        "ticker": "DRI", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "14.55", 
        "div_avg": "2.4", 
        "pb_avg": "1.3", 
        "s_rank": 92, 
        "div_cur": "2.38", 
        "pb_cur": "1.88", 
        "pe_avg": "22.4", 
        "ps_cur": "2.58", 
        "ticker": "CCL", 
        "ps_avg": "2.0"
    }, 
    {
        "pe_cur": "28.32", 
        "div_avg": "2.1", 
        "pb_avg": "2.8", 
        "s_rank": 396, 
        "div_cur": "2.14", 
        "pb_cur": "2.22", 
        "pe_avg": "23.9", 
        "ps_cur": "3.74", 
        "ticker": "MDT", 
        "ps_avg": "3.5"
    }, 
    {
        "pe_cur": "26.73", 
        "div_avg": "3.0", 
        "pb_avg": "3.8", 
        "s_rank": 409, 
        "div_cur": "4.13", 
        "pb_cur": "4.33", 
        "pe_avg": "39.9", 
        "ps_cur": "9.67", 
        "ticker": "EXR", 
        "ps_avg": "11.2"
    }, 
    {
        "pe_cur": "14.72", 
        "div_avg": "1.7", 
        "pb_avg": "2.8", 
        "s_rank": 204, 
        "div_cur": "1.67", 
        "pb_cur": "3.45", 
        "pe_avg": "15.8", 
        "ps_cur": "1.20", 
        "ticker": "FL", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "22.14", 
        "div_avg": "2.3", 
        "pb_avg": "6.5", 
        "s_rank": 241, 
        "div_cur": "3.18", 
        "pb_cur": "8.49", 
        "pe_avg": "17.8", 
        "ps_cur": "0.49", 
        "ticker": "JWN", 
        "ps_avg": "0.9"
    }, 
    {
        "pe_cur": "29.73", 
        "div_avg": "4.4", 
        "pb_avg": "1.3", 
        "s_rank": 41, 
        "div_cur": "3.66", 
        "pb_cur": "1.29", 
        "pe_avg": "17.0", 
        "ps_cur": "1.07", 
        "ticker": "EXC", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "17.90", 
        "div_avg": "2.4", 
        "pb_avg": "5.8", 
        "s_rank": 289, 
        "div_cur": "2.57", 
        "pb_cur": "9.29", 
        "pe_avg": "17.1", 
        "ps_cur": "1.30", 
        "ticker": "OMC", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "20.95", 
        "div_avg": "2.4", 
        "pb_avg": "1.3", 
        "s_rank": 17, 
        "div_cur": "2.78", 
        "pb_cur": "1.51", 
        "pe_avg": "16.7", 
        "ps_cur": "0.41", 
        "ticker": "ADM", 
        "ps_avg": "0.3"
    }, 
    {
        "pe_cur": "12.73", 
        "div_avg": "3.2", 
        "pb_avg": "1.8", 
        "s_rank": 1, 
        "div_cur": "5.24", 
        "pb_cur": "1.26", 
        "pe_avg": "13.2", 
        "ps_cur": "0.35", 
        "ticker": "KSS", 
        "ps_avg": "0.6"
    }, 
    {
        "pe_cur": "23.14", 
        "div_avg": "1.1", 
        "pb_avg": "3.4", 
        "s_rank": 441, 
        "div_cur": "1.12", 
        "pb_cur": "5.71", 
        "pe_avg": "20.9", 
        "ps_cur": "2.70", 
        "ticker": "AON", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "29.77", 
        "div_avg": "1.3", 
        "pb_avg": "2.5", 
        "s_rank": 420, 
        "div_cur": "1.69", 
        "pb_cur": "2.87", 
        "pe_avg": "18.8", 
        "ps_cur": "2.90", 
        "ticker": "FLIR", 
        "ps_avg": "2.6"
    }, 
    {
        "pe_cur": "10.95", 
        "div_avg": "2.6", 
        "pb_avg": "0.8", 
        "s_rank": 2, 
        "div_cur": "2.82", 
        "pb_cur": "0.99", 
        "pe_avg": "20.5", 
        "ps_cur": "0.75", 
        "ticker": "PRU", 
        "ps_avg": "0.6"
    }, 
    {
        "pe_cur": "16.62", 
        "div_avg": "1.5", 
        "pb_avg": "0.8", 
        "s_rank": 204, 
        "div_cur": "1.79", 
        "pb_cur": "1.10", 
        "pe_avg": "15.0", 
        "ps_cur": "3.24", 
        "ticker": "RF", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "29.75", 
        "div_avg": "2.3", 
        "pb_avg": "1.9", 
        "s_rank": 424, 
        "div_cur": "1.94", 
        "pb_cur": "2.67", 
        "pe_avg": "22.0", 
        "ps_cur": "4.23", 
        "ticker": "AWK", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "9.77", 
        "div_avg": "3.2", 
        "pb_avg": "3.4", 
        "s_rank": 346, 
        "div_cur": "3.73", 
        "pb_cur": "5.91", 
        "pe_avg": "12.6", 
        "ps_cur": "1.22", 
        "ticker": "LYB", 
        "ps_avg": "0.9"
    }, 
    {
        "pe_cur": "46.15", 
        "div_avg": "1.4", 
        "pb_avg": "4.3", 
        "s_rank": 190, 
        "div_cur": "2.46", 
        "pb_cur": "1.81", 
        "pe_avg": "23.8", 
        "ps_cur": "0.94", 
        "ticker": "RL", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "22.30", 
        "div_avg": "1.9", 
        "pb_avg": "2.3", 
        "s_rank": 266, 
        "div_cur": "1.73", 
        "pb_cur": "2.86", 
        "pe_avg": "14.6", 
        "ps_cur": "0.97", 
        "ticker": "PGR", 
        "ps_avg": "0.9"
    }, 
    {
        "pe_cur": "32.60", 
        "div_avg": "2.2", 
        "pb_avg": "18.0", 
        "s_rank": 409, 
        "div_cur": "2.27", 
        "pb_cur": "29.46", 
        "pe_avg": "29.1", 
        "ps_cur": "3.11", 
        "ticker": "HSY", 
        "ps_avg": "2.9"
    }, 
    {
        "pe_cur": "29.08", 
        "div_avg": "3.4", 
        "pb_avg": "2.6", 
        "s_rank": 378, 
        "div_cur": "3.74", 
        "pb_cur": "3.49", 
        "pe_avg": "22.3", 
        "ps_cur": "3.85", 
        "ticker": "PFE", 
        "ps_avg": "3.8"
    }, 
    {
        "pe_cur": "28.93", 
        "div_avg": "3.1", 
        "pb_avg": "10.5", 
        "s_rank": 346, 
        "div_cur": "4.07", 
        "pb_cur": "12.49", 
        "pe_avg": "37.3", 
        "ps_cur": "9.81", 
        "ticker": "SPG", 
        "ps_avg": "10.6"
    }, 
    {
        "pe_cur": "46.20", 
        "div_avg": "1.7", 
        "pb_avg": "2.3", 
        "s_rank": 436, 
        "div_cur": "1.46", 
        "pb_cur": "2.68", 
        "pe_avg": "28.2", 
        "ps_cur": "2.83", 
        "ticker": "FIS", 
        "ps_avg": "2.5"
    }, 
    {
        "pe_cur": "56.22", 
        "div_avg": "0.1", 
        "pb_avg": "5.7", 
        "s_rank": 469, 
        "div_cur": "0.05", 
        "pb_cur": "4.50", 
        "pe_avg": "24.0", 
        "ps_cur": "3.13", 
        "ticker": "GPN", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "28.43", 
        "div_avg": "1.6", 
        "pb_avg": "4.7", 
        "s_rank": 461, 
        "div_cur": "1.45", 
        "pb_cur": "6.36", 
        "pe_avg": "25.9", 
        "ps_cur": "3.61", 
        "ticker": "CHD", 
        "ps_avg": "3.1"
    }, 
    {
        "pe_cur": "22.74", 
        "div_avg": "3.6", 
        "pb_avg": "3.2", 
        "s_rank": 335, 
        "div_cur": "3.89", 
        "pb_cur": "3.35", 
        "pe_avg": "40.8", 
        "ps_cur": "4.17", 
        "ticker": "D", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "5.39", 
        "div_avg": "3.1", 
        "pb_avg": "2.5", 
        "s_rank": 409, 
        "div_cur": "3.24", 
        "pb_cur": "2.26", 
        "pe_avg": "118.1", 
        "ps_cur": "9.54", 
        "ticker": "EQR", 
        "ps_avg": "9.4"
    }, 
    {
        "pe_cur": "24.51", 
        "div_avg": "0.6", 
        "pb_avg": "0.8", 
        "s_rank": 266, 
        "div_cur": "0.53", 
        "pb_cur": "0.87", 
        "pe_avg": "53.4", 
        "ps_cur": "1.21", 
        "ticker": "L", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "20.73", 
        "div_avg": "2.4", 
        "pb_avg": "3.5", 
        "s_rank": 360, 
        "div_cur": "1.92", 
        "pb_cur": "4.29", 
        "pe_avg": "27.0", 
        "ps_cur": "1.84", 
        "ticker": "HRS", 
        "ps_avg": "1.4"
    }, 
    {
        "pe_cur": "15.84", 
        "div_avg": "1.9", 
        "pb_avg": "3.9", 
        "s_rank": 346, 
        "div_cur": "2.80", 
        "pb_cur": "4.01", 
        "pe_avg": "18.6", 
        "ps_cur": "5.20", 
        "ticker": "AMGN", 
        "ps_avg": "5.0"
    }, 
    {
        "pe_cur": "20.84", 
        "div_avg": "1.6", 
        "pb_avg": "3.8", 
        "s_rank": 346, 
        "div_cur": "1.97", 
        "pb_cur": "3.99", 
        "pe_avg": "22.8", 
        "ps_cur": "1.92", 
        "ticker": "HRL", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "33.52", 
        "div_avg": "3.1", 
        "pb_avg": "2.2", 
        "s_rank": 360, 
        "div_cur": "3.21", 
        "pb_cur": "3.46", 
        "pe_avg": "41.5", 
        "ps_cur": "2.17", 
        "ticker": "GE", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "19.56", 
        "div_avg": "2.1", 
        "pb_avg": "3.0", 
        "s_rank": 360, 
        "div_cur": "1.79", 
        "pb_cur": "5.10", 
        "pe_avg": "14.8", 
        "ps_cur": "1.79", 
        "ticker": "GD", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "22.22", 
        "div_avg": "3.0", 
        "pb_avg": "4.8", 
        "s_rank": 396, 
        "div_cur": "2.29", 
        "pb_cur": "6.45", 
        "pe_avg": "19.6", 
        "ps_cur": "2.39", 
        "ticker": "HAS", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "15.27", 
        "div_avg": "3.2", 
        "pb_avg": "72.9", 
        "s_rank": 204, 
        "div_cur": "2.71", 
        "pb_cur": "51.07", 
        "pe_avg": "15.9", 
        "ps_cur": "1.63", 
        "ticker": "LMT", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "14.23", 
        "div_avg": "2.6", 
        "pb_avg": "5.1", 
        "s_rank": 8, 
        "div_cur": "3.88", 
        "pb_cur": "3.15", 
        "pe_avg": "14.5", 
        "ps_cur": "0.59", 
        "ticker": "GPS", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "34.76", 
        "div_avg": "1.3", 
        "pb_avg": "6.0", 
        "s_rank": 447, 
        "div_cur": "1.29", 
        "pb_cur": "6.63", 
        "pe_avg": "30.9", 
        "ps_cur": "10.00", 
        "ticker": "MAR", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "16.35", 
        "div_avg": "2.1", 
        "pb_avg": "3.6", 
        "s_rank": 131, 
        "div_cur": "2.95", 
        "pb_cur": "4.74", 
        "pe_avg": "18.4", 
        "ps_cur": "1.22", 
        "ticker": "IPG", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "17.87", 
        "div_avg": "1.5", 
        "pb_avg": "1.9", 
        "s_rank": 371, 
        "div_cur": "1.70", 
        "pb_cur": "3.61", 
        "pe_avg": "11.4", 
        "ps_cur": "2.55", 
        "ticker": "SNA", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "19.96", 
        "div_avg": "3.3", 
        "pb_avg": "1.4", 
        "s_rank": 92, 
        "div_cur": "2.79", 
        "pb_cur": "1.65", 
        "pe_avg": "18.4", 
        "ps_cur": "2.14", 
        "ticker": "CINF", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "20.00", 
        "div_avg": "2.0", 
        "pb_avg": "1.8", 
        "s_rank": 378, 
        "div_cur": "1.76", 
        "pb_cur": "2.21", 
        "pe_avg": "19.1", 
        "ps_cur": "3.93", 
        "ticker": "NTRS", 
        "ps_avg": "3.5"
    }, 
    {
        "pe_cur": "38.23", 
        "div_avg": "3.9", 
        "pb_avg": "2.7", 
        "s_rank": 190, 
        "div_cur": "3.42", 
        "pb_cur": "1.82", 
        "pe_avg": "57.3", 
        "ps_cur": "10.37", 
        "ticker": "MAA", 
        "ps_avg": "5.9"
    }, 
    {
        "pe_cur": "18.96", 
        "div_avg": "0.8", 
        "pb_avg": "3.4", 
        "s_rank": 390, 
        "div_cur": "1.12", 
        "pb_cur": "4.05", 
        "pe_avg": "17.1", 
        "ps_cur": "2.07", 
        "ticker": "FOXA", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "26.79", 
        "div_avg": "0.8", 
        "pb_avg": "5.0", 
        "s_rank": 461, 
        "div_cur": "0.91", 
        "pb_cur": "5.84", 
        "pe_avg": "22.6", 
        "ps_cur": "3.40", 
        "ticker": "APH", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "27.44", 
        "div_avg": "4.0", 
        "pb_avg": "2.0", 
        "s_rank": 289, 
        "div_cur": "4.89", 
        "pb_cur": "1.77", 
        "pe_avg": "44.0", 
        "ps_cur": "7.94", 
        "ticker": "KIM", 
        "ps_avg": "9.4"
    }, 
    {
        "pe_cur": "22.42", 
        "div_avg": "0.9", 
        "pb_avg": "8.5", 
        "s_rank": 429, 
        "div_cur": "0.98", 
        "pb_cur": "8.92", 
        "pe_avg": "20.4", 
        "ps_cur": "1.90", 
        "ticker": "ROST", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "9.53", 
        "div_avg": "0.8", 
        "pb_avg": "2.8", 
        "s_rank": 306, 
        "div_cur": "1.79", 
        "pb_cur": "1.82", 
        "pe_avg": "19.1", 
        "ps_cur": "0.71", 
        "ticker": "SIG", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "52.06", 
        "div_avg": "2.5", 
        "pb_avg": "3.6", 
        "s_rank": 424, 
        "div_cur": "2.82", 
        "pb_cur": "4.11", 
        "pe_avg": "22.8", 
        "ps_cur": "3.08", 
        "ticker": "APD", 
        "ps_avg": "2.5"
    }, 
    {
        "pe_cur": "19.69", 
        "div_avg": "1.2", 
        "pb_avg": "3.1", 
        "s_rank": 390, 
        "div_cur": "1.53", 
        "pb_cur": "2.26", 
        "pe_avg": "25.8", 
        "ps_cur": "3.95", 
        "ticker": "KSU", 
        "ps_avg": "4.5"
    }, 
    {
        "pe_cur": "54.40", 
        "div_avg": "3.8", 
        "pb_avg": "1.5", 
        "s_rank": 241, 
        "div_cur": "3.51", 
        "pb_cur": "1.92", 
        "pe_avg": "17.5", 
        "ps_cur": "2.04", 
        "ticker": "AEP", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "20.10", 
        "div_avg": "2.9", 
        "pb_avg": "2.0", 
        "s_rank": 204, 
        "div_cur": "2.99", 
        "pb_cur": "2.11", 
        "pe_avg": "20.8", 
        "ps_cur": "2.69", 
        "ticker": "SRE", 
        "ps_avg": "2.2"
    }, 
    {
        "pe_cur": "14.14", 
        "div_avg": "1.2", 
        "pb_avg": "2.7", 
        "s_rank": 241, 
        "div_cur": "1.92", 
        "pb_cur": "1.96", 
        "pe_avg": "14.0", 
        "ps_cur": "3.65", 
        "ticker": "BEN", 
        "ps_avg": "3.7"
    }, 
    {
        "pe_cur": "20.10", 
        "div_avg": "1.1", 
        "pb_avg": "2.0", 
        "s_rank": 204, 
        "div_cur": "1.55", 
        "pb_cur": "2.50", 
        "pe_avg": "13.8", 
        "ps_cur": "0.71", 
        "ticker": "AET", 
        "ps_avg": "0.6"
    }, 
    {
        "pe_cur": "18.22", 
        "div_avg": "2.4", 
        "pb_avg": "3.2", 
        "s_rank": 149, 
        "div_cur": "2.74", 
        "pb_cur": "3.65", 
        "pe_avg": "14.5", 
        "ps_cur": "1.43", 
        "ticker": "CMI", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "28.64", 
        "div_avg": "3.0", 
        "pb_avg": "5.9", 
        "s_rank": 429, 
        "div_cur": "3.49", 
        "pb_cur": "7.92", 
        "pe_avg": "22.7", 
        "ps_cur": "4.37", 
        "ticker": "KO", 
        "ps_avg": "3.9"
    }, 
    {
        "pe_cur": "26.01", 
        "div_avg": "2.4", 
        "pb_avg": "1.2", 
        "s_rank": 241, 
        "div_cur": "2.25", 
        "pb_cur": "1.95", 
        "pe_avg": "22.7", 
        "ps_cur": "11.11", 
        "ticker": "CME", 
        "ps_avg": "8.2"
    }, 
    {
        "pe_cur": "13.95", 
        "div_avg": "2.0", 
        "pb_avg": "3.1", 
        "s_rank": 41, 
        "div_cur": "2.55", 
        "pb_cur": "2.58", 
        "pe_avg": "14.6", 
        "ps_cur": "1.30", 
        "ticker": "EMN", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "18.55", 
        "div_avg": "4.3", 
        "pb_avg": "2.5", 
        "s_rank": 164, 
        "div_cur": "3.99", 
        "pb_cur": "2.75", 
        "pe_avg": "18.3", 
        "ps_cur": "3.11", 
        "ticker": "GRMN", 
        "ps_avg": "3.1"
    }, 
    {
        "pe_cur": "25.38", 
        "div_avg": "1.6", 
        "pb_avg": "0.7", 
        "s_rank": 406, 
        "div_cur": "1.34", 
        "pb_cur": "1.51", 
        "pe_avg": "12.0", 
        "ps_cur": "4.55", 
        "ticker": "CMA", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "19.85", 
        "div_avg": "2.1", 
        "pb_avg": "2.9", 
        "s_rank": 436, 
        "div_cur": "1.03", 
        "pb_cur": "5.39", 
        "pe_avg": "56.6", 
        "ps_cur": "3.50", 
        "ticker": "AMAT", 
        "ps_avg": "2.5"
    }, 
    {
        "pe_cur": "26.34", 
        "div_avg": "1.8", 
        "pb_avg": "5.2", 
        "s_rank": 441, 
        "div_cur": "1.95", 
        "pb_cur": "6.42", 
        "pe_avg": "22.1", 
        "ps_cur": "3.34", 
        "ticker": "IFF", 
        "ps_avg": "2.6"
    }, 
    {
        "pe_cur": "20.41", 
        "div_avg": "4.0", 
        "pb_avg": "1.4", 
        "s_rank": 92, 
        "div_cur": "3.22", 
        "pb_cur": "1.88", 
        "pe_avg": "31.9", 
        "ps_cur": "2.28", 
        "ticker": "AEE", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "25.55", 
        "div_avg": "1.2", 
        "pb_avg": "3.7", 
        "s_rank": 450, 
        "div_cur": "0.84", 
        "pb_cur": "5.98", 
        "pe_avg": "21.8", 
        "ps_cur": "2.53", 
        "ticker": "CTAS", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "27.86", 
        "div_avg": "0.6", 
        "pb_avg": "2.5", 
        "s_rank": 396, 
        "div_cur": "0.82", 
        "pb_cur": "3.45", 
        "pe_avg": "24.8", 
        "ps_cur": "0.91", 
        "ticker": "FDX", 
        "ps_avg": "0.9"
    }, 
    {
        "pe_cur": "15.00", 
        "div_avg": "1.1", 
        "pb_avg": "5.5", 
        "s_rank": 406, 
        "div_cur": "1.53", 
        "pb_cur": "5.30", 
        "pe_avg": "16.4", 
        "ps_cur": "2.96", 
        "ticker": "SNI", 
        "ps_avg": "3.8"
    }, 
    {
        "pe_cur": "22.78", 
        "div_avg": "3.4", 
        "pb_avg": "2.4", 
        "s_rank": 241, 
        "div_cur": "2.97", 
        "pb_cur": "2.97", 
        "pe_avg": "18.7", 
        "ps_cur": "1.98", 
        "ticker": "CMS", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "29.70", 
        "div_avg": "1.3", 
        "pb_avg": "11.4", 
        "s_rank": 420, 
        "div_cur": "1.54", 
        "pb_cur": "14.64", 
        "pe_avg": "386.4", 
        "ps_cur": "3.91", 
        "ticker": "SBUX", 
        "ps_avg": "3.8"
    }, 
    {
        "pe_cur": "22.83", 
        "div_avg": "1.9", 
        "pb_avg": "12.4", 
        "s_rank": 346, 
        "div_cur": "2.43", 
        "pb_cur": "40.71", 
        "pe_avg": "22.4", 
        "ps_cur": "1.86", 
        "ticker": "HD", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "17.13", 
        "div_avg": "1.6", 
        "pb_avg": "6.1", 
        "s_rank": 281, 
        "div_cur": "1.97", 
        "pb_cur": "5.37", 
        "pe_avg": "21.8", 
        "ps_cur": "1.11", 
        "ticker": "RHI", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "33.09", 
        "div_avg": "3.2", 
        "pb_avg": "4.5", 
        "s_rank": 447, 
        "div_cur": "2.46", 
        "pb_cur": "6.42", 
        "pe_avg": "22.8", 
        "ps_cur": "4.24", 
        "ticker": "LLY", 
        "ps_avg": "3.2"
    }, 
    {
        "pe_cur": "26.84", 
        "div_avg": "2.2", 
        "pb_avg": "6.2", 
        "s_rank": 450, 
        "div_cur": "1.96", 
        "pb_cur": "9.74", 
        "pe_avg": "18.5", 
        "ps_cur": "3.36", 
        "ticker": "ROK", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "13.37", 
        "div_avg": "0.8", 
        "pb_avg": "1.8", 
        "s_rank": 65, 
        "div_cur": "1.20", 
        "pb_cur": "1.78", 
        "pe_avg": "16.0", 
        "ps_cur": "0.98", 
        "ticker": "DHI", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "83.60", 
        "div_avg": "2.5", 
        "pb_avg": "0.7", 
        "s_rank": 111, 
        "div_cur": "3.05", 
        "pb_cur": "0.84", 
        "pe_avg": "18.6", 
        "ps_cur": "0.89", 
        "ticker": "MET", 
        "ps_avg": "0.7"
    }, 
    {
        "pe_cur": "17.75", 
        "div_avg": "3.1", 
        "pb_avg": "2.0", 
        "s_rank": 34, 
        "div_cur": "3.24", 
        "pb_cur": "2.25", 
        "pe_avg": "16.3", 
        "ps_cur": "1.70", 
        "ticker": "ETN", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "22.91", 
        "div_avg": "2.2", 
        "pb_avg": "5.5", 
        "s_rank": 416, 
        "div_cur": "2.67", 
        "pb_cur": "6.70", 
        "pe_avg": "23.8", 
        "ps_cur": "3.20", 
        "ticker": "PX", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "20.25", 
        "div_avg": "2.5", 
        "pb_avg": "2.9", 
        "s_rank": 319, 
        "div_cur": "2.09", 
        "pb_cur": "4.36", 
        "pe_avg": "14.5", 
        "ps_cur": "1.82", 
        "ticker": "RTN", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "24.75", 
        "div_avg": "0.6", 
        "pb_avg": "3.8", 
        "s_rank": 450, 
        "div_cur": "0.67", 
        "pb_cur": "3.78", 
        "pe_avg": "21.7", 
        "ps_cur": "3.21", 
        "ticker": "AME", 
        "ps_avg": "3.1"
    }, 
    {
        "pe_cur": "18.23", 
        "div_avg": "3.6", 
        "pb_avg": "2.7", 
        "s_rank": 221, 
        "div_cur": "4.38", 
        "pb_cur": "2.25", 
        "pe_avg": "43.3", 
        "ps_cur": "8.51", 
        "ticker": "MAC", 
        "ps_avg": "9.3"
    }, 
    {
        "pe_cur": "46.50", 
        "div_avg": "3.3", 
        "pb_avg": "3.5", 
        "s_rank": 346, 
        "div_cur": "3.01", 
        "pb_cur": "3.04", 
        "pe_avg": "79.1", 
        "ps_cur": "10.66", 
        "ticker": "REG", 
        "ps_avg": "10.1"
    }, 
    {
        "pe_cur": "16.38", 
        "div_avg": "3.1", 
        "pb_avg": "3.3", 
        "s_rank": 319, 
        "div_cur": "2.98", 
        "pb_cur": "4.42", 
        "pe_avg": "22.1", 
        "ps_cur": "3.53", 
        "ticker": "PG", 
        "ps_avg": "2.9"
    }, 
    {
        "pe_cur": "18.08", 
        "div_avg": "2.1", 
        "pb_avg": "1.7", 
        "s_rank": 204, 
        "div_cur": "1.81", 
        "pb_cur": "2.75", 
        "pe_avg": "20.0", 
        "ps_cur": "1.20", 
        "ticker": "LLL", 
        "ps_avg": "0.8"
    }, 
    {
        "pe_cur": "36.94", 
        "div_avg": "1.8", 
        "pb_avg": "4.6", 
        "s_rank": 360, 
        "div_cur": "1.62", 
        "pb_cur": "1.95", 
        "pe_avg": "32.8", 
        "ps_cur": "1.67", 
        "ticker": "NWL", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "16.61", 
        "div_avg": "2.2", 
        "pb_avg": "2.2", 
        "s_rank": 149, 
        "div_cur": "2.31", 
        "pb_cur": "3.15", 
        "pe_avg": "14.4", 
        "ps_cur": "1.68", 
        "ticker": "AMP", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "24.72", 
        "div_avg": "1.9", 
        "pb_avg": "2.8", 
        "s_rank": 416, 
        "div_cur": "1.65", 
        "pb_cur": "4.70", 
        "pe_avg": "16.2", 
        "ps_cur": "1.90", 
        "ticker": "PH", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "20.11", 
        "div_avg": "2.8", 
        "pb_avg": "5.7", 
        "s_rank": 396, 
        "div_cur": "2.87", 
        "pb_cur": "5.49", 
        "pe_avg": "40.2", 
        "ps_cur": "4.57", 
        "ticker": "BMY", 
        "ps_avg": "5.1"
    }, 
    {
        "pe_cur": "61.59", 
        "div_avg": "1.6", 
        "pb_avg": "7.8", 
        "s_rank": 471, 
        "div_cur": "2.05", 
        "pb_cur": "7.62", 
        "pe_avg": "56.8", 
        "ps_cur": "8.91", 
        "ticker": "AMT", 
        "ps_avg": "9.8"
    }, 
    {
        "pe_cur": "33.68", 
        "div_avg": "1.2", 
        "pb_avg": "4.3", 
        "s_rank": 470, 
        "div_cur": "1.15", 
        "pb_cur": "6.14", 
        "pe_avg": "27.8", 
        "ps_cur": "5.20", 
        "ticker": "EFX", 
        "ps_avg": "4.0"
    }, 
    {
        "pe_cur": "29.15", 
        "div_avg": "1.2", 
        "pb_avg": "8.2", 
        "s_rank": 457, 
        "div_cur": "1.63", 
        "pb_cur": "8.23", 
        "pe_avg": "27.8", 
        "ps_cur": "2.75", 
        "ticker": "EL", 
        "ps_avg": "2.8"
    }, 
    {
        "pe_cur": "12.69", 
        "div_avg": "0.3", 
        "pb_avg": "0.7", 
        "s_rank": 164, 
        "div_cur": "1.07", 
        "pb_cur": "0.80", 
        "pe_avg": "13.8", 
        "ps_cur": "2.62", 
        "ticker": "C", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "26.16", 
        "div_avg": "1.3", 
        "pb_avg": "2.6", 
        "s_rank": 266, 
        "div_cur": "1.60", 
        "pb_cur": "2.31", 
        "pe_avg": "15.9", 
        "ps_cur": "0.38", 
        "ticker": "FLR", 
        "ps_avg": "0.4"
    }, 
    {
        "pe_cur": "30.58", 
        "div_avg": "1.0", 
        "pb_avg": "3.1", 
        "s_rank": 466, 
        "div_cur": "0.79", 
        "pb_cur": "3.86", 
        "pe_avg": "28.3", 
        "ps_cur": "7.06", 
        "ticker": "SCHW", 
        "ps_avg": "5.5"
    }, 
    {
        "pe_cur": "19.01", 
        "div_avg": "4.1", 
        "pb_avg": "1.6", 
        "s_rank": 27, 
        "div_cur": "3.55", 
        "pb_cur": "1.68", 
        "pe_avg": "16.7", 
        "ps_cur": "1.98", 
        "ticker": "ED", 
        "ps_avg": "1.4"
    }, 
    {
        "pe_cur": "18.62", 
        "div_avg": "0.9", 
        "pb_avg": "3.3", 
        "s_rank": 385, 
        "div_cur": "1.14", 
        "pb_cur": "3.98", 
        "pe_avg": "17.1", 
        "ps_cur": "2.03", 
        "ticker": "FOX", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "53.25", 
        "div_avg": "4.7", 
        "pb_avg": "2.4", 
        "s_rank": 289, 
        "div_cur": "4.24", 
        "pb_cur": "2.44", 
        "pe_avg": "51.9", 
        "ps_cur": "14.09", 
        "ticker": "O", 
        "ps_avg": "11.8"
    }, 
    {
        "pe_cur": "49.20", 
        "div_avg": "4.7", 
        "pb_avg": "3.4", 
        "s_rank": 435, 
        "div_cur": "3.50", 
        "pb_cur": "4.16", 
        "pe_avg": "55.8", 
        "ps_cur": "7.88", 
        "ticker": "DLR", 
        "ps_avg": "5.9"
    }, 
    {
        "pe_cur": "26.37", 
        "div_avg": "2.2", 
        "pb_avg": "2.6", 
        "s_rank": 441, 
        "div_cur": "1.55", 
        "pb_cur": "3.75", 
        "pe_avg": "14.8", 
        "ps_cur": "3.95", 
        "ticker": "CSX", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "20.17", 
        "div_avg": "2.4", 
        "pb_avg": "1.8", 
        "s_rank": 335, 
        "div_cur": "2.62", 
        "pb_cur": "2.14", 
        "pe_avg": "17.5", 
        "ps_cur": "5.57", 
        "ticker": "BLK", 
        "ps_avg": "4.9"
    }, 
    {
        "pe_cur": "26.44", 
        "div_avg": "3.0", 
        "pb_avg": "8.9", 
        "s_rank": 360, 
        "div_cur": "3.15", 
        "pb_cur": "11.04", 
        "pe_avg": "24.9", 
        "ps_cur": "6.74", 
        "ticker": "PAYX", 
        "ps_avg": "6.2"
    }, 
    {
        "pe_cur": "25.47", 
        "div_avg": "4.9", 
        "pb_avg": "1.8", 
        "s_rank": 266, 
        "div_cur": "4.89", 
        "pb_cur": "1.87", 
        "pe_avg": "124.5", 
        "ps_cur": "6.18", 
        "ticker": "HCN", 
        "ps_avg": "6.6"
    }, 
    {
        "pe_cur": "20.11", 
        "div_avg": "3.3", 
        "pb_avg": "1.6", 
        "s_rank": 75, 
        "div_cur": "3.23", 
        "pb_cur": "1.76", 
        "pe_avg": "19.1", 
        "ps_cur": "2.46", 
        "ticker": "ES", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "27.53", 
        "div_avg": "4.5", 
        "pb_avg": "4.1", 
        "s_rank": 221, 
        "div_cur": "5.95", 
        "pb_cur": "3.58", 
        "pe_avg": "20.0", 
        "ps_cur": "1.58", 
        "ticker": "MAT", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "31.64", 
        "div_avg": "1.0", 
        "pb_avg": "10.8", 
        "s_rank": 464, 
        "div_cur": "1.17", 
        "pb_cur": "38.01", 
        "pe_avg": "36.6", 
        "ps_cur": "6.14", 
        "ticker": "INTU", 
        "ps_avg": "5.3"
    }, 
    {
        "pe_cur": "30.47", 
        "div_avg": "0.5", 
        "pb_avg": "13.2", 
        "s_rank": 424, 
        "div_cur": "0.78", 
        "pb_cur": "21.42", 
        "pe_avg": "27.8", 
        "ps_cur": "11.21", 
        "ticker": "MA", 
        "ps_avg": "10.1"
    }, 
    {
        "pe_cur": "22.56", 
        "div_avg": "2.5", 
        "pb_avg": "1.7", 
        "s_rank": 371, 
        "div_cur": "2.03", 
        "pb_cur": "7.64", 
        "pe_avg": "10.9", 
        "ps_cur": "1.16", 
        "ticker": "AVY", 
        "ps_avg": "0.5"
    }, 
    {
        "pe_cur": "44.42", 
        "div_avg": "0.8", 
        "pb_avg": "7.0", 
        "s_rank": 429, 
        "div_cur": "0.71", 
        "pb_cur": "3.70", 
        "pe_avg": "25.6", 
        "ps_cur": "1.40", 
        "ticker": "BLL", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "34.34", 
        "div_avg": "2.6", 
        "pb_avg": "1.5", 
        "s_rank": 204, 
        "div_cur": "2.06", 
        "pb_cur": "1.06", 
        "pe_avg": "12.2", 
        "ps_cur": "1.42", 
        "ticker": "MOS", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "27.03", 
        "div_avg": "2.0", 
        "pb_avg": "5.5", 
        "s_rank": 441, 
        "div_cur": "1.92", 
        "pb_cur": "7.26", 
        "pe_avg": "25.7", 
        "ps_cur": "2.82", 
        "ticker": "MKC", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "32.69", 
        "div_avg": "3.1", 
        "pb_avg": "6.1", 
        "s_rank": 385, 
        "div_cur": "3.65", 
        "pb_cur": "7.64", 
        "pe_avg": "38.3", 
        "ps_cur": "14.75", 
        "ticker": "PSA", 
        "ps_avg": "15.1"
    }, 
    {
        "pe_cur": "19.42", 
        "div_avg": "2.0", 
        "pb_avg": "3.5", 
        "s_rank": 396, 
        "div_cur": "1.51", 
        "pb_cur": "7.86", 
        "pe_avg": "13.9", 
        "ps_cur": "1.68", 
        "ticker": "NOC", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "24.51", 
        "div_avg": "1.0", 
        "pb_avg": "3.5", 
        "s_rank": 441, 
        "div_cur": "1.05", 
        "pb_cur": "7.76", 
        "pe_avg": "18.5", 
        "ps_cur": "2.16", 
        "ticker": "CBS", 
        "ps_avg": "2.0"
    }, 
    {
        "pe_cur": "22.53", 
        "div_avg": "2.2", 
        "pb_avg": "2.0", 
        "s_rank": 241, 
        "div_cur": "2.29", 
        "pb_cur": "2.09", 
        "pe_avg": "23.7", 
        "ps_cur": "2.04", 
        "ticker": "SJM", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "108.02", 
        "div_avg": "1.5", 
        "pb_avg": "1.3", 
        "s_rank": 221, 
        "div_cur": "1.86", 
        "pb_cur": "2.12", 
        "pe_avg": "18.7", 
        "ps_cur": "3.11", 
        "ticker": "NDAQ", 
        "ps_avg": "2.2"
    }, 
    {
        "pe_cur": "14.41", 
        "div_avg": "1.2", 
        "pb_avg": "0.8", 
        "s_rank": 75, 
        "div_cur": "1.87", 
        "pb_cur": "1.13", 
        "pe_avg": "99.0", 
        "ps_cur": "2.25", 
        "ticker": "MS", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "178.88", 
        "div_avg": "3.2", 
        "pb_avg": "4.2", 
        "s_rank": 420, 
        "div_cur": "1.97", 
        "pb_cur": "6.16", 
        "pe_avg": "45.6", 
        "ps_cur": "5.16", 
        "ticker": "MCHP", 
        "ps_avg": "5.0"
    }, 
    {
        "pe_cur": "24.70", 
        "div_avg": "3.0", 
        "pb_avg": "2.4", 
        "s_rank": 241, 
        "div_cur": "3.09", 
        "pb_cur": "2.50", 
        "pe_avg": "70.3", 
        "ps_cur": "12.40", 
        "ticker": "AVB", 
        "ps_avg": "12.5"
    }, 
    {
        "pe_cur": "14.04", 
        "div_avg": "1.2", 
        "pb_avg": "1.0", 
        "s_rank": 241, 
        "div_cur": "1.14", 
        "pb_cur": "1.25", 
        "pe_avg": "12.9", 
        "ps_cur": "3.09", 
        "ticker": "GS", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "15.05", 
        "div_avg": "0.6", 
        "pb_avg": "2.5", 
        "s_rank": 335, 
        "div_cur": "0.74", 
        "pb_cur": "3.89", 
        "pe_avg": "20.7", 
        "ps_cur": "1.61", 
        "ticker": "LUV", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "20.76", 
        "div_avg": "3.0", 
        "pb_avg": "2.2", 
        "s_rank": 289, 
        "div_cur": "3.06", 
        "pb_cur": "2.51", 
        "pe_avg": "18.5", 
        "ps_cur": "3.78", 
        "ticker": "NEE", 
        "ps_avg": "2.5"
    }, 
    {
        "pe_cur": "25.60", 
        "div_avg": "2.8", 
        "pb_avg": "7.5", 
        "s_rank": 281, 
        "div_cur": "2.69", 
        "pb_cur": "14.21", 
        "pe_avg": "21.8", 
        "ps_cur": "2.54", 
        "ticker": "PEP", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "19.46", 
        "div_avg": "2.1", 
        "pb_avg": "10.3", 
        "s_rank": 390, 
        "div_cur": "2.06", 
        "pb_cur": "9.16", 
        "pe_avg": "18.3", 
        "ps_cur": "2.16", 
        "ticker": "ACN", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "88.41", 
        "div_avg": "5.5", 
        "pb_avg": "3.3", 
        "s_rank": 385, 
        "div_cur": "2.32", 
        "pb_cur": "1.39", 
        "pe_avg": "166.1", 
        "ps_cur": "3.67", 
        "ticker": "KMI", 
        "ps_avg": "3.8"
    }, 
    {
        "pe_cur": "23.28", 
        "div_avg": "1.8", 
        "pb_avg": "5.3", 
        "s_rank": 378, 
        "div_cur": "2.11", 
        "pb_cur": "7.58", 
        "pe_avg": "21.5", 
        "ps_cur": "1.34", 
        "ticker": "GWW", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "22.55", 
        "div_avg": "2.1", 
        "pb_avg": "2.0", 
        "s_rank": 27, 
        "div_cur": "2.88", 
        "pb_cur": "1.93", 
        "pe_avg": "10.0", 
        "ps_cur": "0.47", 
        "ticker": "MPC", 
        "ps_avg": "0.3"
    }, 
    {
        "pe_cur": "12.22", 
        "div_avg": "1.4", 
        "pb_avg": "0.9", 
        "s_rank": 51, 
        "div_cur": "1.85", 
        "pb_cur": "0.85", 
        "pe_avg": "9.9", 
        "ps_cur": "2.12", 
        "ticker": "COF", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "21.09", 
        "div_avg": "7.5", 
        "pb_avg": "1.2", 
        "s_rank": 4, 
        "div_cur": "9.15", 
        "pb_cur": "0.99", 
        "pe_avg": "27.9", 
        "ps_cur": "0.76", 
        "ticker": "CTL", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "21.98", 
        "div_avg": "3.2", 
        "pb_avg": "5.7", 
        "s_rank": 289, 
        "div_cur": "3.32", 
        "pb_cur": "3.93", 
        "pe_avg": "18.6", 
        "ps_cur": "2.43", 
        "ticker": "COH", 
        "ps_avg": "2.8"
    }, 
    {
        "pe_cur": "78.22", 
        "div_avg": "1.1", 
        "pb_avg": "0.9", 
        "s_rank": 346, 
        "div_cur": "0.96", 
        "pb_cur": "0.92", 
        "pe_avg": "57.6", 
        "ps_cur": "0.86", 
        "ticker": "LUK", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "24.82", 
        "div_avg": "2.1", 
        "pb_avg": "2.8", 
        "s_rank": 346, 
        "div_cur": "2.16", 
        "pb_cur": "3.28", 
        "pe_avg": "15.9", 
        "ps_cur": "1.84", 
        "ticker": "DOV", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "17.85", 
        "div_avg": "1.6", 
        "pb_avg": "6.3", 
        "s_rank": 396, 
        "div_cur": "1.36", 
        "pb_cur": "5.84", 
        "pe_avg": "16.3", 
        "ps_cur": "2.44", 
        "ticker": "COL", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "35.42", 
        "div_avg": "0.6", 
        "pb_avg": "6.7", 
        "s_rank": 450, 
        "div_cur": "0.42", 
        "pb_cur": "10.83", 
        "pe_avg": "45.6", 
        "ps_cur": "4.83", 
        "ticker": "BCR", 
        "ps_avg": "3.7"
    }, 
    {
        "pe_cur": "8.29", 
        "div_avg": "2.3", 
        "pb_avg": "1.2", 
        "s_rank": 371, 
        "div_cur": "2.30", 
        "pb_cur": "1.59", 
        "pe_avg": "15.0", 
        "ps_cur": "2.64", 
        "ticker": "GLW", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "17.48", 
        "div_avg": "2.8", 
        "pb_avg": "10.3", 
        "s_rank": 306, 
        "div_cur": "2.25", 
        "pb_cur": "15.55", 
        "pe_avg": "18.4", 
        "ps_cur": "4.60", 
        "ticker": "KLAC", 
        "ps_avg": "3.5"
    }, 
    {
        "pe_cur": "23.35", 
        "div_avg": "3.3", 
        "pb_avg": "1.7", 
        "s_rank": 111, 
        "div_cur": "2.96", 
        "pb_cur": "1.89", 
        "pe_avg": "23.5", 
        "ps_cur": "1.71", 
        "ticker": "NI", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "46.47", 
        "div_avg": "1.9", 
        "pb_avg": "1.5", 
        "s_rank": 385, 
        "div_cur": "2.90", 
        "pb_cur": "1.52", 
        "pe_avg": "80.6", 
        "ps_cur": "6.05", 
        "ticker": "SLG", 
        "ps_avg": "6.3"
    }, 
    {
        "pe_cur": "17.19", 
        "div_avg": "2.5", 
        "pb_avg": "2.6", 
        "s_rank": 221, 
        "div_cur": "3.80", 
        "pb_cur": "2.42", 
        "pe_avg": "67.0", 
        "ps_cur": "7.82", 
        "ticker": "GGP", 
        "ps_avg": "8.5"
    }, 
    {
        "pe_cur": "15.94", 
        "div_avg": "3.8", 
        "pb_avg": "1.6", 
        "s_rank": 17, 
        "div_cur": "3.72", 
        "pb_cur": "1.67", 
        "pe_avg": "14.8", 
        "ps_cur": "2.26", 
        "ticker": "SCG", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "24.37", 
        "div_avg": "3.5", 
        "pb_avg": "1.8", 
        "s_rank": 281, 
        "div_cur": "3.18", 
        "pb_cur": "2.36", 
        "pe_avg": "17.0", 
        "ps_cur": "2.74", 
        "ticker": "LNT", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "30.24", 
        "div_avg": "1.1", 
        "pb_avg": "4.4", 
        "s_rank": 455, 
        "div_cur": "1.18", 
        "pb_cur": "5.28", 
        "pe_avg": "33.0", 
        "ps_cur": "2.77", 
        "ticker": "ECL", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "29.47", 
        "div_avg": "2.1", 
        "pb_avg": "7.7", 
        "s_rank": 436, 
        "div_cur": "2.49", 
        "pb_cur": "7.74", 
        "pe_avg": "29.5", 
        "ps_cur": "3.78", 
        "ticker": "FAST", 
        "ps_avg": "3.9"
    }, 
    {
        "pe_cur": "17.50", 
        "div_avg": "1.7", 
        "pb_avg": "7.4", 
        "s_rank": 149, 
        "div_cur": "1.47", 
        "pb_cur": "13.67", 
        "pe_avg": "37.8", 
        "ps_cur": "1.23", 
        "ticker": "SEE", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "20.24", 
        "div_avg": "2.8", 
        "pb_avg": "1.7", 
        "s_rank": 164, 
        "div_cur": "2.71", 
        "pb_cur": "2.19", 
        "pe_avg": "16.6", 
        "ps_cur": "2.21", 
        "ticker": "EIX", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "15.02", 
        "div_avg": "0.1", 
        "pb_avg": "2.2", 
        "s_rank": 111, 
        "div_cur": "0.15", 
        "pb_cur": "1.67", 
        "pe_avg": "25.3", 
        "ps_cur": "0.97", 
        "ticker": "PVH", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "21.70", 
        "div_avg": "1.8", 
        "pb_avg": "2.3", 
        "s_rank": 306, 
        "div_cur": "1.84", 
        "pb_cur": "2.90", 
        "pe_avg": "15.4", 
        "ps_cur": "1.79", 
        "ticker": "DGX", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "42.01", 
        "div_avg": "2.0", 
        "pb_avg": "2.0", 
        "s_rank": 419, 
        "div_cur": "1.76", 
        "pb_cur": "2.67", 
        "pe_avg": "25.6", 
        "ps_cur": "2.59", 
        "ticker": "MDLZ", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "43.95", 
        "div_avg": "1.2", 
        "pb_avg": "4.0", 
        "s_rank": 409, 
        "div_cur": "1.58", 
        "pb_cur": "3.76", 
        "pe_avg": "19.3", 
        "ps_cur": "1.56", 
        "ticker": "FLS", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "69.05", 
        "div_avg": "0.8", 
        "pb_avg": "1.3", 
        "s_rank": 459, 
        "div_cur": "0.89", 
        "pb_cur": "4.54", 
        "pe_avg": "8.6", 
        "ps_cur": "2.13", 
        "ticker": "EXPE", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "23.93", 
        "div_avg": "1.5", 
        "pb_avg": "4.4", 
        "s_rank": 409, 
        "div_cur": "1.43", 
        "pb_cur": "5.50", 
        "pe_avg": "23.4", 
        "ps_cur": "1.67", 
        "ticker": "EXPD", 
        "ps_avg": "1.4"
    }, 
    {
        "pe_cur": "26.47", 
        "div_avg": "4.4", 
        "pb_avg": "1.3", 
        "s_rank": 131, 
        "div_cur": "4.16", 
        "pb_cur": "1.41", 
        "pe_avg": "21.1", 
        "ps_cur": "2.59", 
        "ticker": "DUK", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "27.34", 
        "div_avg": "2.4", 
        "pb_avg": "6.5", 
        "s_rank": 385, 
        "div_cur": "2.25", 
        "pb_cur": "11.99", 
        "pe_avg": "25.2", 
        "ps_cur": "3.80", 
        "ticker": "ADP", 
        "ps_avg": "3.2"
    }, 
    {
        "pe_cur": "9.80", 
        "div_avg": "3.3", 
        "pb_avg": "2.5", 
        "s_rank": 51, 
        "div_cur": "5.24", 
        "pb_cur": "1.53", 
        "pe_avg": "9.1", 
        "ps_cur": "0.29", 
        "ticker": "F", 
        "ps_avg": "0.4"
    }, 
    {
        "pe_cur": "23.45", 
        "div_avg": "5.6", 
        "pb_avg": "1.8", 
        "s_rank": 319, 
        "div_cur": "4.76", 
        "pb_cur": "2.63", 
        "pe_avg": "30.1", 
        "ps_cur": "6.85", 
        "ticker": "HCP", 
        "ps_avg": "8.5"
    }, 
    {
        "pe_cur": "15.51", 
        "div_avg": "2.2", 
        "pb_avg": "1.0", 
        "s_rank": 65, 
        "div_cur": "2.03", 
        "pb_cur": "1.32", 
        "pe_avg": "13.0", 
        "ps_cur": "2.02", 
        "ticker": "CB", 
        "ps_avg": "1.4"
    }, 
    {
        "pe_cur": "16.86", 
        "div_avg": "3.5", 
        "pb_avg": "2.3", 
        "s_rank": 164, 
        "div_cur": "3.23", 
        "pb_cur": "2.35", 
        "pe_avg": "15.2", 
        "ps_cur": "3.29", 
        "ticker": "CA", 
        "ps_avg": "2.9"
    }, 
    {
        "pe_cur": "11.53", 
        "div_avg": "1.5", 
        "pb_avg": "2.3", 
        "s_rank": 289, 
        "div_cur": "1.75", 
        "pb_cur": "2.39", 
        "pe_avg": "10.6", 
        "ps_cur": "3.52", 
        "ticker": "DFS", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "39.20", 
        "div_avg": "1.2", 
        "pb_avg": "2.2", 
        "s_rank": 457, 
        "div_cur": "0.52", 
        "pb_cur": "10.16", 
        "pe_avg": "13.6", 
        "ps_cur": "8.53", 
        "ticker": "NVDA", 
        "ps_avg": "2.2"
    }, 
    {
        "pe_cur": "15.52", 
        "div_avg": "2.1", 
        "pb_avg": "2.1", 
        "s_rank": 14, 
        "div_cur": "2.36", 
        "pb_cur": "1.96", 
        "pe_avg": "15.3", 
        "ps_cur": "0.59", 
        "ticker": "R", 
        "ps_avg": "0.6"
    }, 
    {
        "pe_cur": "26.67", 
        "div_avg": "2.8", 
        "pb_avg": "101.9", 
        "s_rank": 429, 
        "div_cur": "2.38", 
        "pb_cur": "63.76", 
        "pe_avg": "21.9", 
        "ps_cur": "2.93", 
        "ticker": "CLX", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "21.32", 
        "div_avg": "3.5", 
        "pb_avg": "1.6", 
        "s_rank": 75, 
        "div_cur": "3.25", 
        "pb_cur": "2.05", 
        "pe_avg": "17.7", 
        "ps_cur": "1.74", 
        "ticker": "DTE", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "12.61", 
        "div_avg": "3.0", 
        "pb_avg": "2.5", 
        "s_rank": 27, 
        "div_cur": "2.40", 
        "pb_cur": "3.17", 
        "pe_avg": "12.5", 
        "ps_cur": "0.38", 
        "ticker": "BBY", 
        "ps_avg": "0.2"
    }, 
    {
        "pe_cur": "38.03", 
        "div_avg": "2.7", 
        "pb_avg": "5.6", 
        "s_rank": 396, 
        "div_cur": "2.93", 
        "pb_cur": "4.87", 
        "pe_avg": "54.1", 
        "ps_cur": "11.97", 
        "ticker": "FRT", 
        "ps_avg": "12.4"
    }, 
    {
        "pe_cur": "17.18", 
        "div_avg": "0.6", 
        "pb_avg": "4.3", 
        "s_rank": 289, 
        "div_cur": "0.76", 
        "pb_cur": "3.99", 
        "pe_avg": "22.8", 
        "ps_cur": "0.16", 
        "ticker": "MCK", 
        "ps_avg": "0.2"
    }, 
    {
        "pe_cur": "16.00", 
        "div_avg": "2.6", 
        "pb_avg": "1.2", 
        "s_rank": 92, 
        "div_cur": "2.68", 
        "pb_cur": "1.33", 
        "pe_avg": "14.3", 
        "ps_cur": "3.48", 
        "ticker": "BBT", 
        "ps_avg": "2.7"
    }, 
    {
        "pe_cur": "46.89", 
        "div_avg": "1.1", 
        "pb_avg": "4.9", 
        "s_rank": 467, 
        "div_cur": "0.95", 
        "pb_cur": "4.91", 
        "pe_avg": "31.8", 
        "ps_cur": "2.93", 
        "ticker": "FMC", 
        "ps_avg": "2.0"
    }, 
    {
        "pe_cur": "27.39", 
        "div_avg": "2.7", 
        "pb_avg": "3.4", 
        "s_rank": 447, 
        "div_cur": "2.22", 
        "pb_cur": "4.66", 
        "pe_avg": "23.6", 
        "ps_cur": "6.81", 
        "ticker": "ADI", 
        "ps_avg": "5.5"
    }, 
    {
        "pe_cur": "21.25", 
        "div_avg": "2.3", 
        "pb_avg": "8.3", 
        "s_rank": 306, 
        "div_cur": "2.35", 
        "pb_cur": "8.58", 
        "pe_avg": "20.6", 
        "ps_cur": "0.82", 
        "ticker": "CHRW", 
        "ps_avg": "0.8"
    }, 
    {
        "pe_cur": "17.44", 
        "div_avg": "1.9", 
        "pb_avg": "0.8", 
        "s_rank": 51, 
        "div_cur": "1.67", 
        "pb_cur": "1.58", 
        "pe_avg": "40.9", 
        "ps_cur": "0.81", 
        "ticker": "ALL", 
        "ps_avg": "0.4"
    }, 
    {
        "pe_cur": "24.22", 
        "div_avg": "3.1", 
        "pb_avg": "1.9", 
        "s_rank": 164, 
        "div_cur": "2.51", 
        "pb_cur": "2.42", 
        "pe_avg": "28.6", 
        "ps_cur": "1.17", 
        "ticker": "NUE", 
        "ps_avg": "0.8"
    }, 
    {
        "pe_cur": "18.47", 
        "div_avg": "3.3", 
        "pb_avg": "4.1", 
        "s_rank": 281, 
        "div_cur": "2.69", 
        "pb_cur": "6.21", 
        "pe_avg": "23.5", 
        "ps_cur": "1.84", 
        "ticker": "LEG", 
        "ps_avg": "1.4"
    }, 
    {
        "pe_cur": "25.89", 
        "div_avg": "1.0", 
        "pb_avg": "17.4", 
        "s_rank": 390, 
        "div_cur": "1.10", 
        "pb_cur": "15.23", 
        "pe_avg": "27.7", 
        "ps_cur": "2.41", 
        "ticker": "SHW", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "18.65", 
        "div_avg": "1.6", 
        "pb_avg": "2.9", 
        "s_rank": 416, 
        "div_cur": "1.21", 
        "pb_cur": "3.12", 
        "pe_avg": "11.2", 
        "ps_cur": "4.42", 
        "ticker": "ALB", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "13.19", 
        "div_avg": "0.4", 
        "pb_avg": "1.9", 
        "s_rank": 92, 
        "div_cur": "0.31", 
        "pb_cur": "1.69", 
        "pe_avg": "18.6", 
        "ps_cur": "1.05", 
        "ticker": "LEN", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "23.27", 
        "div_avg": "2.3", 
        "pb_avg": "5.9", 
        "s_rank": 319, 
        "div_cur": "2.46", 
        "pb_cur": "11.02", 
        "pe_avg": "19.1", 
        "ps_cur": "3.77", 
        "ticker": "MMM", 
        "ps_avg": "2.9"
    }, 
    {
        "pe_cur": "14.40", 
        "div_avg": "1.4", 
        "pb_avg": "4.8", 
        "s_rank": 164, 
        "div_cur": "1.63", 
        "pb_cur": "4.04", 
        "pe_avg": "17.9", 
        "ps_cur": "0.23", 
        "ticker": "KR", 
        "ps_avg": "0.2"
    }, 
    {
        "pe_cur": "23.38", 
        "div_avg": "3.2", 
        "pb_avg": "1.5", 
        "s_rank": 92, 
        "div_cur": "3.39", 
        "pb_cur": "1.87", 
        "pe_avg": "137.4", 
        "ps_cur": "10.18", 
        "ticker": "PLD", 
        "ps_avg": "10.2"
    }, 
    {
        "pe_cur": "19.66", 
        "div_avg": "4.6", 
        "pb_avg": "2.1", 
        "s_rank": 65, 
        "div_cur": "4.50", 
        "pb_cur": "2.02", 
        "pe_avg": "19.3", 
        "ps_cur": "2.51", 
        "ticker": "SO", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "13.06", 
        "div_avg": "1.3", 
        "pb_avg": "0.8", 
        "s_rank": 17, 
        "div_cur": "1.78", 
        "pb_cur": "1.00", 
        "pe_avg": "12.6", 
        "ps_cur": "1.09", 
        "ticker": "LNC", 
        "ps_avg": "0.9"
    }, 
    {
        "pe_cur": "21.87", 
        "div_avg": "1.9", 
        "pb_avg": "1.0", 
        "s_rank": 335, 
        "div_cur": "1.92", 
        "pb_cur": "1.37", 
        "pe_avg": "12.4", 
        "ps_cur": "3.90", 
        "ticker": "KEY", 
        "ps_avg": "2.6"
    }, 
    {
        "pe_cur": "23.09", 
        "div_avg": "2.1", 
        "pb_avg": "4.6", 
        "s_rank": 346, 
        "div_cur": "1.98", 
        "pb_cur": "10.69", 
        "pe_avg": "17.7", 
        "ps_cur": "3.34", 
        "ticker": "ITW", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "9.81", 
        "div_avg": "4.3", 
        "pb_avg": "27.2", 
        "s_rank": 396, 
        "div_cur": "3.41", 
        "pb_cur": "10.93", 
        "pe_avg": "19.5", 
        "ps_cur": "7.22", 
        "ticker": "MO", 
        "ps_avg": "5.0"
    }, 
    {
        "pe_cur": "21.68", 
        "div_avg": "2.1", 
        "pb_avg": "3.8", 
        "s_rank": 420, 
        "div_cur": "1.84", 
        "pb_cur": "6.10", 
        "pe_avg": "19.7", 
        "ps_cur": "2.86", 
        "ticker": "MMC", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "15.54", 
        "div_avg": "0.7", 
        "pb_avg": "0.7", 
        "s_rank": 241, 
        "div_cur": "1.27", 
        "pb_cur": "0.96", 
        "pe_avg": "64.9", 
        "ps_cur": "3.04", 
        "ticker": "BAC", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "21.37", 
        "div_avg": "3.0", 
        "pb_avg": "5.5", 
        "s_rank": 346, 
        "div_cur": "3.28", 
        "pb_cur": "8.19", 
        "pe_avg": "20.6", 
        "ps_cur": "2.11", 
        "ticker": "GIS", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "35.19", 
        "div_avg": "2.7", 
        "pb_avg": "1.7", 
        "s_rank": 396, 
        "div_cur": "2.04", 
        "pb_cur": "2.77", 
        "pe_avg": "22.2", 
        "ps_cur": "2.26", 
        "ticker": "RSG", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "21.20", 
        "div_avg": "2.6", 
        "pb_avg": "5.5", 
        "s_rank": 409, 
        "div_cur": "2.38", 
        "pb_cur": "8.32", 
        "pe_avg": "18.4", 
        "ps_cur": "2.76", 
        "ticker": "DPS", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "13.93", 
        "div_avg": "2.7", 
        "pb_avg": "11.0", 
        "s_rank": 241, 
        "div_cur": "3.21", 
        "pb_cur": "8.96", 
        "pe_avg": "12.4", 
        "ps_cur": "2.04", 
        "ticker": "IBM", 
        "ps_avg": "2.0"
    }, 
    {
        "pe_cur": "10.38", 
        "div_avg": "1.8", 
        "pb_avg": "0.9", 
        "s_rank": 6, 
        "div_cur": "2.23", 
        "pb_cur": "1.29", 
        "pe_avg": "13.5", 
        "ps_cur": "0.70", 
        "ticker": "AIZ", 
        "ps_avg": "0.5"
    }, 
    {
        "pe_cur": "41.28", 
        "div_avg": "2.2", 
        "pb_avg": "3.3", 
        "s_rank": 450, 
        "div_cur": "2.26", 
        "pb_cur": "3.69", 
        "pe_avg": "46.1", 
        "ps_cur": "8.06", 
        "ticker": "BXP", 
        "ps_avg": "8.2"
    }, 
    {
        "pe_cur": "32.37", 
        "div_avg": "0.5", 
        "pb_avg": "3.3", 
        "s_rank": 467, 
        "div_cur": "0.68", 
        "pb_cur": "3.64", 
        "pe_avg": "25.1", 
        "ps_cur": "5.57", 
        "ticker": "ROP", 
        "ps_avg": "4.3"
    }, 
    {
        "pe_cur": "15.69", 
        "div_avg": "1.5", 
        "pb_avg": "2.3", 
        "s_rank": 17, 
        "div_cur": "2.56", 
        "pb_cur": "2.22", 
        "pe_avg": "20.0", 
        "ps_cur": "0.46", 
        "ticker": "CVS", 
        "ps_avg": "0.7"
    }, 
    {
        "pe_cur": "5.83", 
        "div_avg": "2.5", 
        "pb_avg": "4.2", 
        "s_rank": 455, 
        "div_cur": "1.00", 
        "pb_cur": "3.42", 
        "pe_avg": "16.8", 
        "ps_cur": "2.79", 
        "ticker": "BAX", 
        "ps_avg": "2.3"
    }, 
    {
        "pe_cur": "16.66", 
        "div_avg": "1.5", 
        "pb_avg": "1.4", 
        "s_rank": 241, 
        "div_cur": "1.96", 
        "pb_cur": "2.31", 
        "pe_avg": "74.9", 
        "ps_cur": "2.48", 
        "ticker": "RCL", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "19.92", 
        "div_avg": "2.0", 
        "pb_avg": "3.4", 
        "s_rank": 204, 
        "div_cur": "2.22", 
        "pb_cur": "4.50", 
        "pe_avg": "27.3", 
        "ps_cur": "0.20", 
        "ticker": "CAH", 
        "ps_avg": "0.2"
    }, 
    {
        "pe_cur": "22.99", 
        "div_avg": "0.2", 
        "pb_avg": "5.4", 
        "s_rank": 390, 
        "div_cur": "0.16", 
        "pb_cur": "3.60", 
        "pe_avg": "19.8", 
        "ps_cur": "1.10", 
        "ticker": "AAP", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "24.52", 
        "div_avg": "1.8", 
        "pb_avg": "3.0", 
        "s_rank": 221, 
        "div_cur": "2.30", 
        "pb_cur": "3.02", 
        "pe_avg": "20.3", 
        "ps_cur": "0.75", 
        "ticker": "PDCO", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "17.00", 
        "div_avg": "3.2", 
        "pb_avg": "2.5", 
        "s_rank": 164, 
        "div_cur": "3.02", 
        "pb_cur": "2.59", 
        "pe_avg": "13.4", 
        "ps_cur": "2.88", 
        "ticker": "INTC", 
        "ps_avg": "2.7"
    }, 
    {
        "pe_cur": "24.94", 
        "div_avg": "0.4", 
        "pb_avg": "5.0", 
        "s_rank": 436, 
        "div_cur": "0.25", 
        "pb_cur": "4.31", 
        "pe_avg": "33.6", 
        "ps_cur": "2.19", 
        "ticker": "AYI", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "11.36", 
        "div_avg": "2.4", 
        "pb_avg": "1.6", 
        "s_rank": 8, 
        "div_cur": "2.37", 
        "pb_cur": "1.43", 
        "pe_avg": "9.7", 
        "ps_cur": "1.27", 
        "ticker": "AFL", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "45.38", 
        "div_avg": "1.6", 
        "pb_avg": "3.0", 
        "s_rank": 409, 
        "div_cur": "1.44", 
        "pb_cur": "3.45", 
        "pe_avg": "18.0", 
        "ps_cur": "1.38", 
        "ticker": "PCAR", 
        "ps_avg": "1.1"
    }, 
    {
        "pe_cur": "32.08", 
        "div_avg": "1.4", 
        "pb_avg": "5.0", 
        "s_rank": 429, 
        "div_cur": "1.52", 
        "pb_cur": "5.60", 
        "pe_avg": "22.3", 
        "ps_cur": "1.83", 
        "ticker": "PPG", 
        "ps_avg": "1.6"
    }, 
    {
        "pe_cur": "18.86", 
        "div_avg": "2.2", 
        "pb_avg": "0.9", 
        "s_rank": 266, 
        "div_cur": "2.40", 
        "pb_cur": "1.54", 
        "pe_avg": "11.0", 
        "ps_cur": "4.27", 
        "ticker": "HBAN", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "29.79", 
        "div_avg": "2.8", 
        "pb_avg": "3.4", 
        "s_rank": 390, 
        "div_cur": "1.98", 
        "pb_cur": "4.05", 
        "pe_avg": "35.9", 
        "ps_cur": "1.59", 
        "ticker": "CAG", 
        "ps_avg": "1.0"
    }, 
    {
        "pe_cur": "20.61", 
        "div_avg": "2.5", 
        "pb_avg": "2.3", 
        "s_rank": 360, 
        "div_cur": "2.15", 
        "pb_cur": "2.69", 
        "pe_avg": "15.0", 
        "ps_cur": "3.37", 
        "ticker": "NSC", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "13.41", 
        "div_avg": "4.6", 
        "pb_avg": "1.8", 
        "s_rank": 92, 
        "div_cur": "4.23", 
        "pb_cur": "2.58", 
        "pe_avg": "14.5", 
        "ps_cur": "3.40", 
        "ticker": "PPL", 
        "ps_avg": "2.0"
    }, 
    {
        "pe_cur": "20.90", 
        "div_avg": "1.3", 
        "pb_avg": "3.6", 
        "s_rank": 429, 
        "div_cur": "1.43", 
        "pb_cur": "3.62", 
        "pe_avg": "16.9", 
        "ps_cur": "4.89", 
        "ticker": "ORCL", 
        "ps_avg": "4.5"
    }, 
    {
        "pe_cur": "38.56", 
        "div_avg": "1.0", 
        "pb_avg": "2.1", 
        "s_rank": 471, 
        "div_cur": "0.61", 
        "pb_cur": "4.02", 
        "pe_avg": "21.4", 
        "ps_cur": "5.60", 
        "ticker": "ATVI", 
        "ps_avg": "4.1"
    }, 
    {
        "pe_cur": "33.93", 
        "div_avg": "4.8", 
        "pb_avg": "14.5", 
        "s_rank": 335, 
        "div_cur": "4.45", 
        "pb_cur": "62.42", 
        "pe_avg": "32.6", 
        "ps_cur": "1.32", 
        "ticker": "OKE", 
        "ps_avg": "0.8"
    }, 
    {
        "pe_cur": "34.09", 
        "div_avg": "1.0", 
        "pb_avg": "3.1", 
        "s_rank": 464, 
        "div_cur": "1.00", 
        "pb_cur": "3.95", 
        "pe_avg": "22.4", 
        "ps_cur": "4.01", 
        "ticker": "A", 
        "ps_avg": "2.5"
    }, 
    {
        "pe_cur": "15.89", 
        "div_avg": "1.9", 
        "pb_avg": "4.4", 
        "s_rank": 266, 
        "div_cur": "2.37", 
        "pb_cur": "5.46", 
        "pe_avg": "16.8", 
        "ps_cur": "1.75", 
        "ticker": "HOG", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "37.04", 
        "div_avg": "2.8", 
        "pb_avg": "3.1", 
        "s_rank": 319, 
        "div_cur": "3.02", 
        "pb_cur": "2.45", 
        "pe_avg": "73.7", 
        "ps_cur": "11.41", 
        "ticker": "ESS", 
        "ps_avg": "11.1"
    }, 
    {
        "pe_cur": "27.90", 
        "div_avg": "4.3", 
        "pb_avg": "2.3", 
        "s_rank": 221, 
        "div_cur": "3.88", 
        "pb_cur": "3.47", 
        "pe_avg": "22.3", 
        "ps_cur": "1.59", 
        "ticker": "CNP", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "19.97", 
        "div_avg": "2.1", 
        "pb_avg": "4.3", 
        "s_rank": 378, 
        "div_cur": "2.13", 
        "pb_cur": "4.85", 
        "pe_avg": "19.7", 
        "ps_cur": "2.39", 
        "ticker": "HON", 
        "ps_avg": "1.8"
    }, 
    {
        "pe_cur": "23.39", 
        "div_avg": "3.1", 
        "pb_avg": "3.1", 
        "s_rank": 204, 
        "div_cur": "3.69", 
        "pb_cur": "4.79", 
        "pe_avg": "20.7", 
        "ps_cur": "0.99", 
        "ticker": "IP", 
        "ps_avg": "0.7"
    }, 
    {
        "pe_cur": "14.64", 
        "div_avg": "1.6", 
        "pb_avg": "2.4", 
        "s_rank": 164, 
        "div_cur": "1.97", 
        "pb_cur": "3.19", 
        "pe_avg": "21.3", 
        "ps_cur": "1.57", 
        "ticker": "IR", 
        "ps_avg": "1.2"
    }, 
    {
        "pe_cur": "14.78", 
        "div_avg": "2.8", 
        "pb_avg": "3.2", 
        "s_rank": 3, 
        "div_cur": "5.09", 
        "pb_cur": "2.03", 
        "pe_avg": "13.8", 
        "ps_cur": "0.34", 
        "ticker": "M", 
        "ps_avg": "0.7"
    }, 
    {
        "pe_cur": "32.91", 
        "div_avg": "1.3", 
        "pb_avg": "3.0", 
        "s_rank": 459, 
        "div_cur": "0.78", 
        "pb_cur": "3.28", 
        "pe_avg": "48.8", 
        "ps_cur": "3.79", 
        "ticker": "MLM", 
        "ps_avg": "2.4"
    }, 
    {
        "pe_cur": "18.02", 
        "div_avg": "1.7", 
        "pb_avg": "1.2", 
        "s_rank": 75, 
        "div_cur": "1.56", 
        "pb_cur": "1.73", 
        "pe_avg": "12.1", 
        "ps_cur": "0.51", 
        "ticker": "ANTM", 
        "ps_avg": "0.4"
    }, 
    {
        "pe_cur": "46.61", 
        "div_avg": "2.3", 
        "pb_avg": "3.0", 
        "s_rank": 424, 
        "div_cur": "2.38", 
        "pb_cur": "3.14", 
        "pe_avg": "24.4", 
        "ps_cur": "3.63", 
        "ticker": "ABT", 
        "ps_avg": "2.6"
    }, 
    {
        "pe_cur": "83.25", 
        "div_avg": "4.8", 
        "pb_avg": "7.6", 
        "s_rank": 396, 
        "div_cur": "6.23", 
        "pb_cur": "4.76", 
        "pe_avg": "45.3", 
        "ps_cur": "2.62", 
        "ticker": "IRM", 
        "ps_avg": "2.1"
    }, 
    {
        "pe_cur": "19.68", 
        "div_avg": "2.7", 
        "pb_avg": "4.0", 
        "s_rank": 149, 
        "div_cur": "2.99", 
        "pb_cur": "4.19", 
        "pe_avg": "19.0", 
        "ps_cur": "0.87", 
        "ticker": "GPC", 
        "ps_avg": "0.9"
    }, 
    {
        "pe_cur": "24.31", 
        "div_avg": "3.3", 
        "pb_avg": "2.7", 
        "s_rank": 241, 
        "div_cur": "2.78", 
        "pb_cur": "2.78", 
        "pe_avg": "23.5", 
        "ps_cur": "1.81", 
        "ticker": "AJG", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "13.97", 
        "div_avg": "2.4", 
        "pb_avg": "1.0", 
        "s_rank": 111, 
        "div_cur": "2.28", 
        "pb_cur": "1.35", 
        "pe_avg": "10.9", 
        "ps_cur": "3.40", 
        "ticker": "JPM", 
        "ps_avg": "2.2"
    }, 
    {
        "pe_cur": "23.00", 
        "div_avg": "1.2", 
        "pb_avg": "6.3", 
        "s_rank": 441, 
        "div_cur": "1.30", 
        "pb_cur": "7.14", 
        "pe_avg": "26.0", 
        "ps_cur": "2.68", 
        "ticker": "NKE", 
        "ps_avg": "2.7"
    }, 
    {
        "pe_cur": "13.94", 
        "div_avg": "2.7", 
        "pb_avg": "1.3", 
        "s_rank": 8, 
        "div_cur": "2.85", 
        "pb_cur": "1.75", 
        "pe_avg": "13.2", 
        "ps_cur": "1.44", 
        "ticker": "PFG", 
        "ps_avg": "1.3"
    }, 
    {
        "pe_cur": "22.00", 
        "div_avg": "1.9", 
        "pb_avg": "2.2", 
        "s_rank": 319, 
        "div_cur": "2.22", 
        "pb_cur": "2.67", 
        "pe_avg": "54.5", 
        "ps_cur": "2.32", 
        "ticker": "PNR", 
        "ps_avg": "1.7"
    }, 
    {
        "pe_cur": "17.05", 
        "div_avg": "2.8", 
        "pb_avg": "2.2", 
        "s_rank": 164, 
        "div_cur": "3.45", 
        "pb_cur": "2.59", 
        "pe_avg": "14.6", 
        "ps_cur": "3.40", 
        "ticker": "CSCO", 
        "ps_avg": "2.7"
    }, 
    {
        "pe_cur": "21.39", 
        "div_avg": "3.7", 
        "pb_avg": "1.6", 
        "s_rank": 149, 
        "div_cur": "3.14", 
        "pb_cur": "1.95", 
        "pe_avg": "16.7", 
        "ps_cur": "2.67", 
        "ticker": "PNW", 
        "ps_avg": "1.9"
    }, 
    {
        "pe_cur": "19.22", 
        "div_avg": "1.2", 
        "pb_avg": "1.8", 
        "s_rank": 289, 
        "div_cur": "1.15", 
        "pb_cur": "2.08", 
        "pe_avg": "17.3", 
        "ps_cur": "1.89", 
        "ticker": "RJF", 
        "ps_avg": "1.5"
    }, 
    {
        "pe_cur": "14.85", 
        "div_avg": "2.8", 
        "pb_avg": "1.7", 
        "s_rank": 21, 
        "div_cur": "3.66", 
        "pb_cur": "1.63", 
        "pe_avg": "16.7", 
        "ps_cur": "2.58", 
        "ticker": "IVZ", 
        "ps_avg": "3.0"
    }, 
    {
        "pe_cur": "52.24", 
        "div_avg": "0.9", 
        "pb_avg": "2.0", 
        "s_rank": 406, 
        "div_cur": "0.76", 
        "pb_cur": "2.94", 
        "pe_avg": "16.7", 
        "ps_cur": "0.58", 
        "ticker": "HUM", 
        "ps_avg": "0.4"
    }, 
    {
        "pe_cur": "16.37", 
        "div_avg": "1.5", 
        "pb_avg": "36.2", 
        "s_rank": 436, 
        "div_cur": "1.27", 
        "pb_cur": "51.74", 
        "pe_avg": "22.8", 
        "ps_cur": "5.94", 
        "ticker": "SPGI", 
        "ps_avg": "4.2"
    }, 
    {
        "pe_cur": "16.34", 
        "div_avg": "2.2", 
        "pb_avg": "1.0", 
        "s_rank": 241, 
        "div_cur": "1.84", 
        "pb_cur": "1.26", 
        "pe_avg": "12.1", 
        "ps_cur": "3.90", 
        "ticker": "PNC", 
        "ps_avg": "2.7"
    }, 
    {
        "pe_cur": "14.90", 
        "div_avg": "4.2", 
        "pb_avg": "5.2", 
        "s_rank": 335, 
        "div_cur": "3.24", 
        "pb_cur": "4.17", 
        "pe_avg": "18.6", 
        "ps_cur": "7.25", 
        "ticker": "RAI", 
        "ps_avg": "4.2"
    }
];
