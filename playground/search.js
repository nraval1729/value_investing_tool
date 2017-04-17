$('#search').keyup(function() {
	var searchField = $('#search').val();
	var userInput = new RegExp(searchField, "i");
	$.getJSON('http://valueinvestingtool.com/practice/historical.json', function(data) {
		var searchOutput = '<ul class="searchResults">';
		$.each(data, function(key, val) {
			if ((val.ticker.search(userInput) != -1)) {
				searchOutput += '<li>';
				searchOutput += '<p>' + val.ticker + '</p>';
				searchOutput += '<p>' + val.pe_avg + '</p>';
				searchOutput += '<p>' + val.ps_avg + '</p>';
				searchOutput += '<p>' + val.pb_avg + '</p>';
				searchOutput += '<p>' + val.div_avg + '</p>';
				searchOutput += '</li>';
			}
		});
		searchOutput += '</ul>';
		if (searchField != "") {
			// Output search result to the update div
			$('#update').html(searchOutput);
		}
		else {
			$('#update').html('');
		}
	});
});