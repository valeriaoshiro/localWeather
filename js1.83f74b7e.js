parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"R5OY":[function(require,module,exports) {
var t,e,n,o,a,i,l,r=[],d=!1;let c=String.fromCharCode(176);const s="2bb1bedd40b4992a13c495cd393870d4",m="rS2UQpzHIG67MZCzm2jYNAXpIGHlnVvm";var u=document.getElementById("city"),p=document.getElementById("inputText"),g=document.getElementById("temperature"),h=document.getElementById("description"),f=document.getElementById("icon"),C=document.getElementById("unit"),v=document.getElementById("degree"),y=document.getElementById("inputSubmit"),E=document.getElementById("choices");function x(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(n){t=n.coords.latitude,e=n.coords.longitude,I(t,e)}),C.addEventListener("click",b,!1),p.addEventListener("keyup",B,!1),y.addEventListener("click",L,!1)}function I(t,e,l){var r=`https://api.openweathermap.org/data/2.5/weather?lat=${t}&lon=${e}&appid=${s}&units=imperial`;$.getJSON(r,function(t){o=Math.floor(t.main.temp),a=Math.floor((o-32)/1.8),g.textContent=o,v.textContent=c+"F",C.className="F",i=t.weather[0].main,h.textContent=i;let e=document.createElement("img");for(e.src=`https://openweathermap.org/img/wn/${t.weather[0].icon}@2x.png`,e.alt=`${t.weather.description} icon`;f.firstChild;)f.removeChild(f.firstChild);for(f.appendChild(e),n=l||`${t.name}, ${t.sys.country}`,u.textContent=n;E.firstChild;)E.removeChild(E.firstChild);E.style.display="none"})}function b(){Number(g.textContent);"F"===C.className?(g.textContent=a,v.textContent=c+"C",C.className="C"):(g.textContent=o,v.textContent=c+"F",C.className="F")}function B(t){if("13"===(t.keyCode||t.which)){var e=p.value;p.value="",k(e)}}function L(t){t.preventDefault();var e=p.value;p.value="",k(e)}function k(t){var e=t.replace(/\s/g,"+");e=`https://open.mapquestapi.com/geocoding/v1/address?key=${m}&location=${e}&thumbMaps=false&maxResults=5`,$.getJSON(e,w)}function w(t){if(0===t.results[0].locations.length){E.style.display="block";var e=document.createElement("p");e.innerHTML="City not found",E.appendChild(e)}else{for(E.style.display="block";E.firstChild;)E.removeChild(E.firstChild);r=[];for(var n=document.createElement("ul"),o=0;o<t.results[0].locations.length;o++){var a=document.createElement("li");let e=t.results[0].locations[o].adminArea5,i=t.results[0].locations[o].adminArea3,l=t.results[0].locations[o].adminArea1;if(e&&i&&l){let d=`${e} ${i} ${l}`;a.innerHTML=d,a.addEventListener("click",N),r.push({city:d,lat:t.results[0].locations[o].latLng.lat,lng:t.results[0].locations[o].latLng.lng}),n.appendChild(a)}}E.appendChild(n)}}function N(t){for(var e=0;e<r.length;e++)t.target.innerHTML===r[e].city&&I(r[e].lat,r[e].lng,r[e].city)}$().ready(function(){x()});
},{}]},{},["R5OY"], null)
//# sourceMappingURL=https://valeriaoshiro.github.io/localWeather/js1.83f74b7e.js.map