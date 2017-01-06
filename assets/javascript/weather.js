//Had to route through my node server to allow https;
$(document).ready(function() {
	weatherURL = "https://delivernow.herokuapp.com/api/weather"
	$.get({url: weatherURL}).done(function(response) {
		$('#description').append(response.weather.weather[0].description);
		$('#temp').prepend(response.weather.main.temp);
	});
});
