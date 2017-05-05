var nameOfSector;


function testTableCells() {

    QUnit.test("Cells are clickable", function(assert) {

        assert.expect( 11 );
         
        var $cell = $( "li.exploreListItem" );
        var cellText = $(this).text();
         
        $cell.on( "click", function() {
            assert.ok( true, "Sector cell was clicked!" );
        });
        
        $cell.trigger( "click" );
        
    });

}


function testSectorTable() {

    QUnit.test("Sector cells load proper sector names", function (assert) {

        var listOfSectors = new Set(Object.keys(infoJSON['sector_to_industries']));

        var textListjQuerySectors = new Set([]);

        $('#sectors td').each(function() {
            textListjQuerySectors.add($(this).text());   
        });

        var $sectorName = $('#exploreSectorList li.exploreListItem');

        $sectorName.on("click", function() {
            nameOfSector = $(this).text();
        });

        $sectorName.trigger('click');
        
        assert.ok(textListjQuerySectors,listOfSectors, "Passed!");

    });
}


function testIndustryTable() {

    QUnit.test("Industry cells load proper industry names", function (assert) {

        var textListjQueryIndustries = new Set([]);

        $('#exploreIndustryList .exploreListItemTextSection').each(function() {
            textListjQueryIndustries.add($(this).text());   
        });

        var listOfIndustries = new Set(Object.keys(infoJSON["sector_to_industries"][nameOfSector]));

        assert.ok(textListjQueryIndustries,listOfIndustries, "Passed!");

    });
}


function testCompanyTable() {

    QUnit.test("Company cells load proper company names", function (assert) {

        var listOfCompanies = new Set(Object.keys(infoJSON["sector_to_industries"][nameOfSector]));

        var textListjQueryCompanies = new Set([]);

        $('#companies td').each(function() {
            textListjQueryCompanies.add($(this).text());   
        });

        assert.ok(textListjQueryCompanies,listOfCompanies, "Passed!");

    });
}


function testHiding() {

    QUnit.module( "Test Sector Page Hiding Events" );
    QUnit.test( "Hides crumbSpace1", function( assert ) {
        $('#crumbSpace1').hide();
        // actual, expected
        assert.equal($('#crumbSpace1').css("display"), undefined, "The crumbSpace1 element is hidden");
    });
    QUnit.test( "Hides sectorCrumb", function( assert ) {
        $('#sectorCrumb').hide();
        // actual, expected
        assert.equal($('#sectorCrumb').css("display"), undefined, "The sectorCrumb element is hidden");
    });
    QUnit.test( "Hides crumbSpace2", function( assert ) {
        $('#crumbSpace2').hide();
        // actual, expected
        assert.equal($('#crumbSpace2').css("display"), undefined, "The crumbSpace2 element is hidden");
    });
    QUnit.test( "Hides industryCrumb", function( assert ) {
        $('#industryCrumb').hide();
        // actual, expected
        assert.equal($('#industryCrumb').css("display"), undefined, "The industryCrumb element is hidden");
    });
    QUnit.test( "Hides industry table", function( assert ) {
        $('#industries').hide();
        // actual, expected
        assert.equal($('#industries').css("display"), undefined, "The industry table is hidden");
    });
    QUnit.test( "Hides company table", function( assert ) {
        $('#companies tbody').hide();
        // actual, expected
        assert.equal($('#companies').css("display"), undefined, "The company table is hidden");
    });



    QUnit.module( "Test Industry Page Hiding Events" );
    QUnit.test( "Hides crumbSpace2", function( assert ) {
        $('#crumbSpace2').hide();
        // actual, expected
        assert.equal($('#crumbSpace2').css("display"), undefined, "The crumbSpace2 element is hidden");
    });
    QUnit.test( "Hides industryCrumb", function( assert ) {
        $('#industryCrumb').hide();
        // actual, expected
        assert.equal($('#industryCrumb').css("display"), undefined, "The industryCrumb element is hidden");
    });
    QUnit.test( "Hides sector table", function( assert ) {
        $('#sectors').hide();
        // actual, expected
        assert.equal($('#sectors').css("display"),undefined, "The sector table is hidden");
    });
    QUnit.test( "Hides company table", function( assert ) {
        $('#companies').hide();
        // actual, expected
        assert.equal($('#companies').css("display"), undefined, "The company table is hidden");
    });



    QUnit.module( "Test Company Page Hiding Events" );
    QUnit.test( "Hides sector table", function( assert ) {
        $('#sectors').hide();
        // actual, expected
        assert.equal($('#sectors').css("display"), null, "The sector table is hidden");
    });
    QUnit.test( "Hides industry table", function( assert ) {
        $('#industries').hide();
        // actual, expected
        assert.equal($('#industries').css("display"), null, "The industry table is hidden");
    });

}


function testShowing() {

    QUnit.module( "Test Breadcrumb Showing Events" );
    QUnit.test( "Shows breadcrumb(s)", function( assert ) {
        $('#breadCrumbs').show();
        // actual, expected
        assert.equal($('#breadCrumbs').css("display"), undefined, "The breadcrumbs are shown");
    });



    QUnit.module( "Test Sector Page Showing Events" );
    QUnit.test( "Shows sector table", function( assert ) {
        $('#sectors').show();
        // actual, expected
        assert.equal($('#sectors').css("display"), undefined, "The sector table is shown");
    });



    QUnit.module( "Test Industry Page Showing Events" );
    QUnit.test( "Shows industry table", function( assert ) {
        $('#industries').show();
        // actual, expected
        assert.equal($('#industries').css("display"), undefined, "The industry table is shown");
    });



    QUnit.module( "Test Company Page Showing Events" );
    QUnit.test( "Shows company table", function( assert ) {
        $('#companies').show();
        // actual, expected
        assert.equal($('#companies').css("display"), undefined, "The company table is shown");
    });
}


// DO NOT DELETE COMMENTS BELOW - Linda

// Note: This test can be added to index page by adding html and css components.
// Testing dropdown menu has not been added to keep the appearance of current homepage.

// First, import the scripts in index.html
	// <script src="https://code.jquery.com/qunit/qunit-2.3.2.js"></script>
    // <script type="text/javascript" src="../test/tests.js"></script>
    // <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.3.2.css">

// Second, Add the following in index.html right below where <body> tag starts:
    // <div id="qunit"></div>
    // <div id="qunit-fixture"></div>
    
// Third, place the dropdown menu along with other buttons on index.html:
// Source: W3schools for drop down menu tutorial.

	// <div class="dropdown">
	//     <button id="exploreButton" class="navButton">Tests</button>
	//     <div class="dropdown-content">
	//         <a href="#" onclick='testTableCells()'>Sector cells are clickable</a>
	//         <a href="#" onclick='testSectorTable()'>Cells load proper sectors</a>
	//         <a href="#" onclick='testIndustryTable()'>Cells load proper industries</a>
	//         <a href="#" onclick='testCompanyTable()'>Cells load proper companies</a>
	//         <a href="#" onclick='testHiding()'>Hidden elements are hidden</a>
	//         <a href="#" onclick='testShowing()'>Shown elements are shown</a>
	//     </div>
	// </div>

// Finally, Add the following in index.css to style the dropdown menu of tests:
// Source: W3schools for drop down menu css.

	// /* The container <div> - needed to position the dropdown content */
	// .dropdown {
	//     position: relative;
	//     display: inline-block;
	// }

	// /* Dropdown Content (Hidden by Default) */
	// .dropdown-content {
	//     display: none;
	//     position: absolute;
	//     background-color: #f9f9f9;
	//     min-width: 160px;
	//     box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	//     z-index: 1;
	// }

	// /* Links inside the dropdown */
	// .dropdown-content a {
	//     color: black;
	//     padding: 12px 16px;
	//     text-decoration: none;
	//     display: block;
	// }

	// /* Change color of dropdown links on hover */
	// .dropdown-content a:hover {background-color: #f1f1f1}

	// /* Show the dropdown menu on hover */
	// .dropdown:hover .dropdown-content {
	//     display: block;
	// }

	// /* Change the background color of the dropdown button when the dropdown content is shown */
	// .dropdown:hover .dropbtn {
	//     background-color: #3e8e41;
	// }