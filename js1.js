//get user's automatically location
//convert city to lat/lon
//get weather
//write city
//write weather
//get user's input location

var latitude, longitude, city, temperatureF, temperatureC, description, icon;
var cityChoices = [];
var fromChoices = false;
let degreeSymbol = String.fromCharCode(176);
const WEATHERAPIKEY = process.env.WEATHER_API_KEY;
const GEOCODINGAPIKEY = process.env.GEOCODING_API_KEY;
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
	var urltemp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHERAPIKEY}&units=imperial`;
	$.getJSON(urltemp, function(data){
		//write the temp
		temperatureF = Math.floor(data.main.temp);
		temperatureC = Math.floor((temperatureF - 32) / 1.8);
		elTemperature.textContent = temperatureF;
		elDegree.textContent = degreeSymbol+"F";
		elUnit.className = "F";
		//write the description
		description = data.weather[0].main;
		elDescription.textContent = description;
		//write the icons depending on description
		let img = document.createElement('img');	
		img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;	
		img.alt = `${data.weather.description} icon`;
		while(elIcon.firstChild)
			elIcon.removeChild(elIcon.firstChild);
		elIcon.appendChild(img);
		
		//write the city, and needs to remove the bottom div (if there is any)	
		if(cityX){
			city = cityX;
		} else {
			city = `${data.name}, ${data.sys.country}`;
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
		elDegree.textContent = degreeSymbol+"C";
		elUnit.className = "C";
	} else { //if already C, change to F
		elTemperature.textContent = temperatureF;	
		elDegree.textContent = degreeSymbol+"F";
		elUnit.className = "F";
	}
}

function getInputEnter(e){ //gets the value from input box when Enter key is pressed, calls getLatLon
	var keyCode = e.keyCode || e.which;
	if (keyCode === '13'){
		var city = elInputText.value;
		elInputText.value = "";
		getLatLon(city);
	}
}

function getInputSubmit(e){ //gets the value from input when submit button is pressed, calls getLatLon
	e.preventDefault();
	var city = elInputText.value;
	elInputText.value = "";
	getLatLon(city);
}	

function getLatLon(c){ //gets the city, converts to latitude and longitude. calls inputCityOptions to validate city
	var url = c.replace(/\s/g, "+");
	url = `https://open.mapquestapi.com/geocoding/v1/address?key=${GEOCODINGAPIKEY}&location=${url}&thumbMaps=false&maxResults=5`;

	$.getJSON(url, inputCityOptions);
}

function inputCityOptions(data){ 
	if(data.results[0].locations.length === 0) { //invalid city input
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
		for(var i = 0; i < data.results[0].locations.length; i++){
			var li = document.createElement("li");
			let cityData = data.results[0].locations[i].adminArea5;
			let stateData = data.results[0].locations[i].adminArea3;
			let countryData = data.results[0].locations[i].adminArea1;
			if(cityData && stateData && countryData){
				let formatedCity = `${cityData} ${stateData} ${countryData}`;
				li.innerHTML =  formatedCity
				li.addEventListener('click', cityClick);
				cityChoices.push({city: formatedCity, lat: data.results[0].locations[i].latLng.lat, lng: data.results[0].locations[i].latLng.lng});
				ul.appendChild(li);
			}
		}
		elChoices.appendChild(ul);
	}
}

function cityClick(city){
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