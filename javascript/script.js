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

async function checkweather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    
    if (response.status == 404){
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    }else{
      var data = await response.json();
        
 document.querySelector(".cityCountry").innerHTML = data.name + ", " + data.sys.country;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";
        
document.querySelector(".precip").innerHTML = Math.round(data.main.rain) + " mm";        
        
document.querySelector(".feels-like").innerHTML = Math.round(data.main.feels_like) + " °c";        
        
document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
    
    }
    
    
  }

function formatUnixTime(dtValue, offSet, options={}){
    const data = new Date ((dtValue + offset)* 1000);
    return datetoLocaleTimeString([], {timeZone: "UTC", ...options })
}

function getLongFormatDateTime(dtValue,offSet,options){
    return formatUnixTime(dtValue,offSet,options)
}
  
  searchBtn.addEventListener("click", ()=>{
    checkweather(searchBox.value);
  })        
