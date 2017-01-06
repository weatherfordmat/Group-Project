$(document).ready(function() {
	weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=30.2672&lon=-97.7431&units=imperial&appid=00844094b756ff0694144e52b9245545"
	$.get({url: weatherURL}).done(function(response) {
		$('#description').append(response.weather[0].description);
		$('#temp').prepend(response.main.temp);
	});
});