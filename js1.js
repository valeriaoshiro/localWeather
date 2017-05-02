//get user's automatically location
//convert city to lat/lon
//get weather
//write city
//write weather
//get user's input location

var latitude, longitude, city, temperatureF, temperatureC, description, icon;
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
	$.ajax({ //gets the user's initial location
		url: "http://ip-api.com/json",
      	async: false,
      	dataType: "json",
      	success: function(data) {
      		latitude = data.lat;
         	longitude = data.lon; 
         	city = data.city + ", " +data.region + ", " + data.countryCode;
         	console.log(latitude, longitude, city);
       }
	});//end of ajax
	writeCity(city);				
	getWeather(latitude, longitude);
	elUnit.addEventListener("click", convertUnit, false); //change from F to C, and the other way around
	elInputText.addEventListener("keyup", getInputEnter, false); //gets the value from input box when enter key is pressed
	elInputSubmit.addEventListener("click", getInputSubmit, false); //gets the value from input when submit button is clicked
}

function writeCity(c){ //uses DOM manipulation to write the city, if there is a list of city choices, it deletes it
	elCity.textContent = c;
	while (elChoices.firstChild) {
   	elChoices.removeChild(elChoices.firstChild);
	}
	elChoices.style.display = "none";
}

function getWeather(lat, lon){ //gets the weather, then calls writeWeather to write it
	var urltemp = "http://api.wunderground.com/api/83a94fa8dcb1eccd/conditions/q/"+String(lat)+","+String(lon)+".json";
	console.log(urltemp);
	$.getJSON(urltemp, writeWeather);
}

function writeWeather(data){ //uses DOM manipulation to write the temperature, description, and icon
	console.log(data);
	temperatureF = Math.floor(data.current_observation.temp_f);
	temperatureC = Math.floor(data.current_observation.temp_c);
	elTemperature.textContent = temperatureF;
	elDegree.textContent = String.fromCharCode(176)+"F";
	elUnit.className = "F";
	description = data.current_observation.weather;
	elDescription.textContent = description;
	icon = data.current_observation.icon;		
	switch(icon){ //changes the icon depending on description
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
	var url = c.replace(" ", "+");
	url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + url + "&key=AIzaSyAP_psCmoAIO-Vd7ZtMUQUdyJYxyHl1anE";
	console.log(url);
	$.getJSON(url, inputCityOptions);
}

function inputCityOptions(data){ 
	// Google is now returning 1 answer. No need to check if there is more than one match.
	if(data.results.length > 1){ //if there is more than one city with the same name					
		while (elChoices.firstChild) { //before it writes, make sure it's empty
   		elChoices.removeChild(elChoices.firstChild);
		}
		elChoices.style.display = "block";
		for(var i = 0; i < data.results.length; i++){ //writes the options
			var a = document.createElement("a");
			a.innerHTML = data.results[i].formatted_address; 
			a.setAttribute("href", "#");
			a.setAttribute("class", "cityChoices");
			a.setAttribute("id", i);
			choices.appendChild(a);
		}
		elChoices.addEventListener("click", function(e){ //a city was chosen from the list of same city names
			itemChosen(e, data);
		}, false); 
	}else if(data.results.length === 1){ //there is only one city
		latitude = data.results[0].geometry.location.lat;
		longitude = data.results[0].geometry.location.lng;
		city = data.results[0].formatted_address;
		writeCity(city);
		getWeather(latitude, longitude);
	}else{ //invalid city input
		elChoices.style.display = "block";
		var p = document.createElement("p");
		p.innerHTML = "City not found"; 
		elChoices.appendChild(p);
	}
}

function itemChosen(e, data){ //a city was chosen from the list of same city names
	var target = e.target;
	var attrId = target.getAttribute("id");
	latitude = data.results[attrId].geometry.location.lat;
	longitude = data.results[attrId].geometry.location.lng;
	city = data.results[attrId].formatted_address;
	writeCity(city);
	getWeather(latitude, longitude);
}

//executes when DOM is fully loaded
$().ready(function () {
	init();//starts the code
});


//I got the weathers icons from:
//http://erikflowers.github.io/weather-icons/