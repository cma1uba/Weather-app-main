let subMenu = document.getElementById("subMenu");
let dayDropdown = document.getElementById("dayDropdown");

// Dropdown menu functions
function toggleMenu(){
    subMenu.classList.toggle("open-menu");
}
function toggleDropdown(){
    dayDropdown.classList.toggle("open-menu");
}

// Weather api
const apiKey = "1f373147fc6e90bb5aa6103aedcaa299";
const currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const currDate = document.querySelector(".currDate");
const forecastElement = document.querySelector(".forecast-grid"); 
const weatherDisplay = document.querySelector(".weather"); 

// Helper function to map OpenWeatherMap icon codes to local image paths
function getWeatherIconPath(iconCode) {
    const codeMap = {
        "01d": "icon-sunny.webp",            // clear sky (day)
        "01n": "icon-sunny.webp",      // clear sky (night)
        "02d": "icon-partly-cloudy.webp",    // few clouds (day)
        "02n": "icon-partly-cloudy.webp",// few clouds (night)
        "03d": "icon-partly-cloudy.webp",    // scattered clouds (day)
        "03n": "icon-partly-cloudy.webp",// scattered clouds (night)
        "04d": "icon-overcast.webp",         // broken/overcast clouds (day)
        "04n": "icon-overcast.webp",         // broken/overcast clouds (night)
        "09d": "icon-rain.webp",             // shower rain (day)
        "09n": "icon-rain.webp",             // shower rain (night)
        "10d": "icon-drizzle.webp",          // rain/drizzle (day)
        "10n": "icon-drizzle.webp",    // rain/drizzle (night)
        "11d": "icon-storm.webp",            // thunderstorm (day)
        "11n": "icon-storm.webp",            // thunderstorm (night)
        "13d": "icon-snow.webp",             // snow (day)
        "13n": "icon-snow.webp",             // snow (night)
        "50d": "icon-fog.webp",              // mist/fog (day)
        "50n": "icon-fog.webp",              // mist/fog (night)
    };
    // Default to sunny if not found, or use a generic cloud icon
    const defaultIcon = "icon-overcast.webp";
    
    // Check if the icon is present in the images/ directory
    const fileName = codeMap[iconCode] || defaultIcon;
    return `images/${fileName}`;
}

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

searchBtn.addEventListener("click", () => {
    checkweather(searchBox.value);
})

async function checkweather(city){
    
    // 1. Get Current Weather Data
    const currentResponse = await fetch(currentApiUrl + city + `&appid=${apiKey}`);

    if (currentResponse.status == 404){
      document.querySelector(".error").style.display = "block";
      weatherDisplay.style.display = "none";
      return; 
    }

    const currentData = await currentResponse.json();
    
    // 2. Get 5-Day Forecast Data
    const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();

    // --- Update Current Weather Display ---
    document.querySelector(".cityCountry").innerHTML = currentData.name + ", " + currentData.sys.country;
    
    updateDateTime();
    const currentTemp = Math.round(currentData.main.temp);
    document.querySelector(".temp").innerHTML = currentTemp; 
    
    document.querySelector(".humidity").innerHTML = currentData.main.humidity + "%"; 
    document.querySelector(".wind").innerHTML = Math.round(currentData.wind.speed) + " km/h";
    document.querySelector(".feels-like").innerHTML = Math.round(currentData.main.feels_like) + "°";
    
    // Update main weather icon
    if (weatherIcon && currentData.weather && currentData.weather.length > 0) {
        const iconCode = currentData.weather[0].icon;
        weatherIcon.src = getWeatherIconPath(iconCode);
        weatherIcon.alt = currentData.weather[0].description;
    }
    
    let precipitation = 0;
    if (currentData.rain && currentData.rain["1h"]) {
        precipitation = currentData.rain["1h"];
    } else if (currentData.snow && currentData.snow["1h"]) {
        precipitation = currentData.snow["1h"];
    }
    document.querySelector(".precip").innerHTML = precipitation + " mm";
    
    document.querySelector(".error").style.display = "none";
    weatherDisplay.style.display = "block";

    // Update forecast
    updateForecast(forecastData);
}

// Function to get the most frequent weather condition for a day
function getDailyIconCode(dayData) {
    const iconCounts = {};
    let maxCount = 0;
    let mostFrequentIcon = '01d'; // Default icon

    dayData.forEach(item => {
        const icon = item.weather[0].icon;
        
        const baseIcon = icon.slice(0, 2); 
        iconCounts[baseIcon] = (iconCounts[baseIcon] || 0) + 1;
        
        if (iconCounts[baseIcon] > maxCount) {
            maxCount = iconCounts[baseIcon];
           
            mostFrequentIcon = icon; 
        }
    });

    // Return the full code of the most frequent weather type (e.g., '10d')
    return mostFrequentIcon;
}


function updateForecast(forecastData){
    // Group forecast by day
    const dailyForecast = {};
    forecastData.list.forEach((item)=>{
        // To create a consistent date key (YYYY-MM-DD)
        const date = new Date(item.dt*1000).toISOString().split('T')[0]; 
        
        if (!dailyForecast[date]){
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });
    
    // Get next 5 days including today
    const allDays = Object.keys(dailyForecast);
    const todayKey = new Date().toISOString().split('T')[0];
    
    const forecastDaysKeys = allDays.slice(0, 6); 
    
    // Clear previous forecast
    forecastElement.innerHTML = "";
    
    // Add items
    forecastDaysKeys.forEach((dayKey) => { 
        const dayData = dailyForecast[dayKey];
        const dayName = new Date(dayKey).toLocaleDateString("en-US", {
            weekday: "short",
        });
        
        // Determine daily high/low temps
        const dayHigh = Math.max(...dayData.map((item) => item.main.temp_max));
        const dayLow = Math.min(...dayData.map((item) => item.main.temp_min)); 
        
        // Determine the single icon for the day
        const dailyIconCode = getDailyIconCode(dayData);
        const iconPath = getWeatherIconPath(dailyIconCode);
        const iconAlt = dayData[0].weather[0].description; // Use first description as alt text
        
        const forecastItem = document.createElement("div");
        forecastItem.className = "day-card"; 
        
        forecastItem.innerHTML = `
        <p class="day">${dayName}</p>
        <img src="${iconPath}" alt="${iconAlt}">
        <div class="temps">
        <p class="temp-max">${Math.round(dayHigh)}&deg;</p>
        <p class="temp-min">${Math.round(dayLow)}&deg;</p>
        </div>
        `;
        forecastElement.appendChild(forecastItem);
    })       
}

// Initial call to load default location
 window.onload = () => {
      checkweather("Lusaka"); 
};
