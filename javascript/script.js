let subMenu = document.getElementById("subMenu");

let dayDropdown = document.getElementById("dayDropdown");

//Dropdown menu functions
function toggleMenu(){
    subMenu.classList.toggle("open-menu");
}
function toggleDropdown(){
    dayDropdown.classList.toggle("open-menu");
}

//Weather api
const apiKey = "1f373147fc6e90bb5aa6103aedcaa299";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
  const searchBtn = document.querySelector("button");
  const weatherIcon = document.querySelector(".weather-icon");
const currDate = document.querySelector(".currDate");

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    currDate.textContent = now.toLocaleDateString("en-US", options);
}

  searchBtn.addEventListener("click", ()=>{
    checkweather(searchBox.value);
  })    

async function checkweather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status == 404){
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    }else{
      var data = await response.json();
        
 document.querySelector(".cityCountry").innerHTML = data.name + ", " + data.sys.country;
        
updateDateTime();        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °c";
        
        
document.querySelector(".temp-min").innerHTML = Math.round(data.main.temp_min) + " °c";
        
document.querySelector(".temp-max").innerHTML = Math.round(data.main.temp_max) + " °c";        
    document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";
        
document.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like) + " °c"; 
        
let precipitation = 0;
if (weather.rain && weather.rain["1h"]) {
    precipitation = Math.round(weather.rain["1h"]);
}
document.querySelector(".precip").innerHTML = precipitation;        
        document.querySelector(".error").style.display = "none";
    
    }
    
    
  }
