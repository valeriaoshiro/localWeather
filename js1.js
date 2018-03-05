//get user's automatically location
//convert city to lat/lon
//get weather
//write city
//write weather
//get user's input location

var latitude, longitude, city, temperatureF, temperatureC, description, icon;
var cityChoices = [];
var fromChoices = false;
//starts with el(as in element) to show it's a HTML element
var elCity = document.getElementById("city");
var elInputText = document.getElementById("inputText");
var elTemperature = document.getElementById("temperature");
var elDescription = document.getElementById("description");
var elIcon = document.getElementById("icon");
var elUnit = document.getElementById("unit");
var elDegree = document.getElementById("degree");
var elInputSubmit = document.getElementById("inputSubmit");
var elChoices = document.getElementById("choices");

function init(){
	if(navigator.geolocation){ //get user's lat and lon
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude;
         	longitude = position.coords.longitude;
         	getWeatherAndCity(latitude, longitude);
		})
	}				
	elUnit.addEventListener("click", convertUnit, false); //change from F to C, and the other way around
	elInputText.addEventListener("keyup", getInputEnter, false); //gets the value from input box when enter key is pressed
	elInputSubmit.addEventListener("click", getInputSubmit, false); //gets the value from input when submit button is clicked
}

function getWeatherAndCity(lat, lon, cityX){ //gets the weather, then calls writeWeatherAndCity to write it
	var urltemp = "https://cors-anywhere.herokuapp.com/http://api.wunderground.com/api/83a94fa8dcb1eccd/conditions/q/"+String(lat)+","+String(lon)+".json";
	console.log(urltemp);
	$.getJSON(urltemp, function(data){
		//write the temp
		temperatureF = Math.floor(data.current_observation.temp_f);
		temperatureC = Math.floor(data.current_observation.temp_c);
		elTemperature.textContent = temperatureF;
		elDegree.textContent = String.fromCharCode(176)+"F";
		elUnit.className = "F";
		//write the description
		description = data.current_observation.weather;
		elDescription.textContent = description;
		//write the icons depending on description
		icon = data.current_observation.icon;		
		switch(icon){ 
			case "clear":
			case "sunny":
				elIcon.className = "wi wi-day-sunny";
				break;
			case "chancerain":
			case "chancetstorms":
			case "rain":
			case "tstorms":
			case "unknown":
				elIcon.className = "wi wi-rain";
				break;
			case "chanceflurries":
			case "chancesnow":
			case "flurries":
			case "snow":
				elIcon.className = "wi wi-snow";
				break;
			case "chancesleet":
			case "sleet":
				elIcon.className = "wi wi-sleet";
				break;
			case "wind":
				elIcon.className = "wi wi-cloudy-gusts";
				break;
			case "fog":
			case "hazy":
				elIcon.className = "wi wi-fog";
				break;	
			case "cloudy":
			case "mostlycloudy":
			case "partlysunny":
				elIcon.className = "wi wi-cloudy";
				break;
			case "partly-cloudy-day":
			case "mostlysunny":
			case "partlycloudy":
				elIcon.className = "wi wi-day-cloudy";
				break;
		}	
		//write the city, and needs to remove the bottom div (if there is any)	
		if(cityX){
			city = cityX;
		} else {
			city = data.current_observation.display_location.full;
		}
		
		elCity.textContent = city;
		while (elChoices.firstChild) {
	   	elChoices.removeChild(elChoices.firstChild);
		}
		elChoices.style.display = "none";	
	});
}

function convertUnit(){ //change from F to C, and the other way around
	var tempNum = Number(elTemperature.textContent);
	if(elUnit.className === "F"){ //if already F, change to C
		elTemperature.textContent = temperatureC;	
		elDegree.textContent = String.fromCharCode(176)+"C";
		elUnit.className = "C";
	} else { //if already C, change to F
		elTemperature.textContent = temperatureF;	
		elDegree.textContent = String.fromCharCode(176)+"F";
		elUnit.className = "F";
	}
}

function getInputEnter(e){ //gets the value from input box when Enter key is pressed, calls getLatLon
	var keyCode = e.keyCode || e.which;
	if (keyCode === '13'){
		var city = elInputText.value;
		console.log(city);
		elInputText.value = "";
		getLatLon(city);
	}
}

function getInputSubmit(e){ //gets the value from input when submit button is pressed, calls getLatLon
	e.preventDefault();
	var city = elInputText.value;
	console.log(city);
	elInputText.value = "";
	getLatLon(city);
}	

function getLatLon(c){ //gets the city, converts to latitude and longitude. calls inputCityOptions to validate city
	var url = c.replace(/\s/g, "+");
	url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + url + "&key=AIzaSyAP_psCmoAIO-Vd7ZtMUQUdyJYxyHl1anE";
	$.getJSON(url, inputCityOptions);
}

function inputCityOptions(data){ 
	//console.log("data", data.results[0].formatted_address);
	if(data.results.length === 0) { //invalid city input
		elChoices.style.display = "block";
		var p = document.createElement("p");
		p.innerHTML = "City not found"; 
		elChoices.appendChild(p);
	} else {
		elChoices.style.display = "block";
		while (elChoices.firstChild) {
   			elChoices.removeChild(elChoices.firstChild);
		}
		cityChoices = [];
		var ul = document.createElement("ul");
		for(var i = 0; i < data.results.length; i++){
			var li = document.createElement("li");
			li.innerHTML = data.results[i].formatted_address;
			li.addEventListener('click', cityClick);
			cityChoices.push({city: data.results[i].formatted_address, lat: data.results[i].geometry.location.lat, lng: data.results[i].geometry.location.lng});
			ul.appendChild(li);
		}
		elChoices.appendChild(ul);
	}
}

function cityClick(city){
	console.log("City was clicked", city.target.innerHTML);
	for(var i = 0; i < cityChoices.length; i++){
		if(city.target.innerHTML === cityChoices[i].city){
			getWeatherAndCity(cityChoices[i].lat, cityChoices[i].lng, cityChoices[i].city);
		}
	}
}

//executes when DOM is fully loaded
$().ready(function () {
	init();//starts the code
});


//I got the weathers icons from:
//http://erikflowers.github.io/weather-icons/