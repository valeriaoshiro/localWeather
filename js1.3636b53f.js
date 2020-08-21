// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js1.js":[function(require,module,exports) {
//get user's automatically location
//convert city to lat/lon
//get weather
//write city
//write weather
//get user's input location
var latitude, longitude, city, temperatureF, temperatureC, description, icon;
var cityChoices = [];
var fromChoices = false;
var degreeSymbol = String.fromCharCode(176);
var WEATHERAPIKEY = "2bb1bedd40b4992a13c495cd393870d4";
var GEOCODINGAPIKEY = "rS2UQpzHIG67MZCzm2jYNAXpIGHlnVvm"; //starts with el(as in element) to show it's a HTML element

var elCity = document.getElementById("city");
var elInputText = document.getElementById("inputText");
var elTemperature = document.getElementById("temperature");
var elDescription = document.getElementById("description");
var elIcon = document.getElementById("icon");
var elUnit = document.getElementById("unit");
var elDegree = document.getElementById("degree");
var elInputSubmit = document.getElementById("inputSubmit");
var elChoices = document.getElementById("choices");

function init() {
  if (navigator.geolocation) {
    //get user's lat and lon
    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      getWeatherAndCity(latitude, longitude);
    });
  }

  elUnit.addEventListener("click", convertUnit, false); //change from F to C, and the other way around

  elInputText.addEventListener("keyup", getInputEnter, false); //gets the value from input box when enter key is pressed

  elInputSubmit.addEventListener("click", getInputSubmit, false); //gets the value from input when submit button is clicked
}

function getWeatherAndCity(lat, lon, cityX) {
  //gets the weather, then calls writeWeatherAndCity to write it
  var urltemp = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(lat, "&lon=").concat(lon, "&appid=").concat(WEATHERAPIKEY, "&units=imperial");
  $.getJSON(urltemp, function (data) {
    //write the temp
    temperatureF = Math.floor(data.main.temp);
    temperatureC = Math.floor((temperatureF - 32) / 1.8);
    elTemperature.textContent = temperatureF;
    elDegree.textContent = degreeSymbol + "F";
    elUnit.className = "F"; //write the description

    description = data.weather[0].main;
    elDescription.textContent = description; //write the icons depending on description

    var img = document.createElement('img');
    img.src = "http://openweathermap.org/img/wn/".concat(data.weather[0].icon, "@2x.png");
    img.alt = "".concat(data.weather.description, " icon");

    while (elIcon.firstChild) {
      elIcon.removeChild(elIcon.firstChild);
    }

    elIcon.appendChild(img); //write the city, and needs to remove the bottom div (if there is any)	

    if (cityX) {
      city = cityX;
    } else {
      city = "".concat(data.name, ", ").concat(data.sys.country);
    }

    elCity.textContent = city;

    while (elChoices.firstChild) {
      elChoices.removeChild(elChoices.firstChild);
    }

    elChoices.style.display = "none";
  });
}

function convertUnit() {
  //change from F to C, and the other way around
  var tempNum = Number(elTemperature.textContent);

  if (elUnit.className === "F") {
    //if already F, change to C
    elTemperature.textContent = temperatureC;
    elDegree.textContent = degreeSymbol + "C";
    elUnit.className = "C";
  } else {
    //if already C, change to F
    elTemperature.textContent = temperatureF;
    elDegree.textContent = degreeSymbol + "F";
    elUnit.className = "F";
  }
}

function getInputEnter(e) {
  //gets the value from input box when Enter key is pressed, calls getLatLon
  var keyCode = e.keyCode || e.which;

  if (keyCode === '13') {
    var city = elInputText.value;
    elInputText.value = "";
    getLatLon(city);
  }
}

function getInputSubmit(e) {
  //gets the value from input when submit button is pressed, calls getLatLon
  e.preventDefault();
  var city = elInputText.value;
  elInputText.value = "";
  getLatLon(city);
}

function getLatLon(c) {
  //gets the city, converts to latitude and longitude. calls inputCityOptions to validate city
  var url = c.replace(/\s/g, "+");
  url = "http://open.mapquestapi.com/geocoding/v1/address?key=".concat(GEOCODINGAPIKEY, "&location=").concat(url, "&thumbMaps=false&maxResults=5");
  $.getJSON(url, inputCityOptions);
}

function inputCityOptions(data) {
  if (data.results[0].locations.length === 0) {
    //invalid city input
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

    for (var i = 0; i < data.results[0].locations.length; i++) {
      var li = document.createElement("li");
      var cityData = data.results[0].locations[i].adminArea5;
      var stateData = data.results[0].locations[i].adminArea3;
      var countryData = data.results[0].locations[i].adminArea1;

      if (cityData && stateData && countryData) {
        var formatedCity = "".concat(cityData, " ").concat(stateData, " ").concat(countryData);
        li.innerHTML = formatedCity;
        li.addEventListener('click', cityClick);
        cityChoices.push({
          city: formatedCity,
          lat: data.results[0].locations[i].latLng.lat,
          lng: data.results[0].locations[i].latLng.lng
        });
        ul.appendChild(li);
      }
    }

    elChoices.appendChild(ul);
  }
}

function cityClick(city) {
  for (var i = 0; i < cityChoices.length; i++) {
    if (city.target.innerHTML === cityChoices[i].city) {
      getWeatherAndCity(cityChoices[i].lat, cityChoices[i].lng, cityChoices[i].city);
    }
  }
} //executes when DOM is fully loaded


$().ready(function () {
  init(); //starts the code
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64447" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js1.js"], null)
//# sourceMappingURL=/js1.3636b53f.js.map