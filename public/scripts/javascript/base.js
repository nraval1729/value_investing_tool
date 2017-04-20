function showExplore() {
    //alert('inside showExplore');
    $("#exploreSection").toggle(true);
    $("#searchSection").toggle(false);
}

function showSearch() {
    //alert('inside showSearch')
    $("#searchSection").toggle(true);
    $("#exploreSection").toggle(false);
}

function doSomething() {
    alert("I did something");
}