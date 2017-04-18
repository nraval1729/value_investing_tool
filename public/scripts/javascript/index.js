$(function() {
	console.log("got here");
	$('#searchLink').click(function(){
		console.log("link was clicked");
	    $.get('/search', function(data) {

	    });
	});

	$('#exploreLink').click(function(){
	    $.get('/explore', function(data) {

	    });
	});
});