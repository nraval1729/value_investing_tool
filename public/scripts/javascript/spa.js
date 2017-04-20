

//alert("hello from spa.js");


$(document).ready(function() {
    
});

function showSearch() {
    $("#searchSection").toggle(true);
    $("#exploreSection").toggle(false);
}

function showExplore() {
    $("#exploreSection").toggle(true);
    $("#searchSection").toggle(false);
}

function doSomething() {
    alert("I did something");
}

$(document).ready(function() {
    $('#searchBarInput').keypress(function (e) {
        if (e.which == 13) doSomething();
    });
});
