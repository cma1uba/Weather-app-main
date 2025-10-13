let subMenu = document.getElementById("subMenu");
let dayDropdown = document.getElementById("dayDropdown");
const dayDropdownSpan = document.querySelector(".top-row .dropdown span");

// Store the raw forecast data globally once fetched
let globalForecastData = null; 

// Dropdown menu functions
function toggleMenu(){
    subMenu.classList.toggle("open-menu");
}
function toggleDropdown(){
    dayDropdown.classList.toggle("open-menu");
}

// Weather api
const apiKey = "1f373147fc6e90bb5aa6103aedcaa299";
// Base URLs for fetching by city name
const currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
// New Base URLs for fetching by coordinates
const currentApiCoordUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const forecastApiCoordUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const currDate = document.querySelector(".currDate");

// Containers for dynamic content
const forecastElement = document.querySelector(".forecast-grid"); 
const hourlyListElement = document.querySelector(".hourly-list");
const weatherDisplay = document.querySelector(".weather"); 

// Function to map OpenWeatherMap icon codes to local image paths
function getWeatherIconPath(iconCode) {
    const codeMap = {
        "01d": "icon-sunny.webp",
        "01n": "icon-sunny.webp",
        "02d": "icon-partly-cloudy.webp",
        "02n": "icon-partly-cloudy.webp",
        "03d": "icon-partly-cloudy.webp",
        "03n": "icon-partly-cloudy.webp",
        "04d": "icon-overcast.webp",
        "04n": "icon-overcast.webp",
        "09d": "icon-rain.webp",
        "09n": "icon-rain.webp",
        "10d": "icon-drizzle.webp",
        "10n": "icon-drizzle.webp",
        "11d": "icon-storm.webp",
        "11n": "icon-storm.webp",
        "13d": "icon-snow.webp",
        "13n": "icon-snow.webp",
        "50d": "icon-fog.webp",
        "50n": "icon-fog.webp",
    };
    const defaultIcon = "icon-overcast.webp";
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

// Function to get the most frequent weather condition for a day (used for daily forecast)
function getDailyIconCode(dayData) {
    const iconCounts = {};
    let maxCount = 0;
    let mostFrequentIcon = dayData[0] ? dayData[0].weather[0].icon : '01d'; 

    dayData.forEach(item => {
        const icon = item.weather[0].icon;
        const baseIcon = icon.slice(0, 2); 
        iconCounts[baseIcon] = (iconCounts[baseIcon] || 0) + 1;
        
        if (iconCounts[baseIcon] > maxCount) {
            maxCount = iconCounts[baseIcon];
            mostFrequentIcon = icon; 
        }
    });
    return mostFrequentIcon;
}

// Function to handle geolocation
function getCoordsAndWeather() {
    // Check if geolocation is supported
    if (navigator.geolocation) {
        // Show loading state or default message while waiting
        document.querySelector(".cityCountry").innerHTML = "Fetching location...";
        weatherDisplay.style.display = "none";
        document.querySelector(".error").style.display = "none";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                checkweather(null, lat, lon);
            },
            (error) => {
                console.error("Geolocation error:", error);
                document.querySelector(".error").style.display = "block";
                document.querySelector(".error p").textContent = "Location access denied. Loading default city (Berlin).";
                // Fallback to a well-known city
                checkweather("London"); 
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        // Browser doesn't support geolocation: Fallback to a default city
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error p").textContent = "Geolocation not supported. Loading default city (London).";
        checkweather("London");
    }
}

searchBtn.addEventListener("click", () => {
    checkweather(searchBox.value);
});

async function checkweather(city, lat = null, lon = null){
    
    let currentEndpoint, forecastEndpoint;
    
    if (city) {
        // Use city name for user searches
        currentEndpoint = currentApiUrl + city + `&appid=${apiKey}`;
        forecastEndpoint = forecastApiUrl + city + `&appid=${apiKey}`;
    } else if (lat !== null && lon !== null) {
        // Use coordinates for Geolocation
        currentEndpoint = `${currentApiCoordUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
        forecastEndpoint = `${forecastApiCoordUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    } else {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".error p").textContent = "Please enter a city or enable location.";
        return;
    }

    // 1. Get Current Weather Data
    const currentResponse = await fetch(currentEndpoint);

    if (currentResponse.status == 404){
      document.querySelector(".error").style.display = "block";
      document.querySelector(".error p").textContent = "Invalid city name or location not found.";
      weatherDisplay.style.display = "none";
      return; 
    }
    
    document.querySelector(".error").style.display = "none";
    const currentData = await currentResponse.json();
    
    // 2. Get 6-Day Forecast Data
    const forecastResponse = await fetch(forecastEndpoint);
    const forecastData = await forecastResponse.json();
    
    // Store data globally
    globalForecastData = forecastData;

    // --- Update Current Weather Display ---
    document.querySelector(".cityCountry").innerHTML = currentData.name + ", " + currentData.sys.country;
    updateDateTime();
    document.querySelector(".temp").innerHTML = Math.round(currentData.main.temp); 
    
    document.querySelector(".humidity").innerHTML = currentData.main.humidity + "%"; 
    document.querySelector(".wind").innerHTML = Math.round(currentData.wind.speed) + " km/h";
    document.querySelector(".feels-like").innerHTML = Math.round(currentData.main.feels_like) + "°";
    
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
    
    weatherDisplay.style.display = "block";

    // Update both forecasts
    const initialDayKey = updateForecast(forecastData);
    
    // Initial hourly forecast update
    if (initialDayKey) {
        const fullDayName = new Date(initialDayKey).toLocaleDateString("en-US", { weekday: "long" });
        dayDropdownSpan.textContent = fullDayName;
        updateHourlyForecast(initialDayKey);
        
        // Setup dropdown event listeners based on the generated days
        setupHourlyDropdownListeners(forecastData);
    }
}

function updateForecast(forecastData){
    const dailyForecast = {};
    forecastData.list.forEach((item)=>{
        const date = new Date(item.dt*1000).toISOString().split('T')[0]; 
        if (!dailyForecast[date]){
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });
    
    const allDays = Object.keys(dailyForecast);
    const forecastDaysKeys = allDays.slice(0, 6); 
    
    forecastElement.innerHTML = "";
    
    forecastDaysKeys.forEach((dayKey) => { 
        const dayData = dailyForecast[dayKey];
        const dayName = new Date(dayKey).toLocaleDateString("en-US", { weekday: "short" });
        
        const dayHigh = Math.max(...dayData.map((item) => item.main.temp_max));
        const dayLow = Math.min(...dayData.map((item) => item.main.temp_min)); 
        
        const dailyIconCode = getDailyIconCode(dayData);
        const iconPath = getWeatherIconPath(dailyIconCode);
        const iconAlt = dayData[0].weather[0].description;
        
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
    
    return forecastDaysKeys.length > 0 ? forecastDaysKeys[0] : null; 
}

function updateHourlyForecast(selectedDayKey) {
    if (!globalForecastData) return;
    
    hourlyListElement.innerHTML = "";
    
    const hourlyDataForDay = globalForecastData.list.filter(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        return date === selectedDayKey;
    });

    hourlyDataForDay.forEach(item => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString("en-US", { hour: 'numeric', hour12: true });
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconPath = getWeatherIconPath(iconCode);
        const iconAlt = item.weather[0].description;

        const hourlyItem = document.createElement("div");
        hourlyItem.className = "hour-item";
        
        hourlyItem.innerHTML = `
        <img src="${iconPath}" alt="${iconAlt}">
        <p class="time">${time}</p>
        <p class="temps">${temp}&deg;</p>
        `;
        hourlyListElement.appendChild(hourlyItem);
    });
    
    dayDropdown.classList.remove("open-menu");
}

function setupHourlyDropdownListeners(forecastData) {
    const dailyForecast = {};
    forecastData.list.forEach((item)=>{
        const date = new Date(item.dt*1000).toISOString().split('T')[0]; 
        if (!dailyForecast[date]){
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });
    
    const allDays = Object.keys(dailyForecast);
    const availableDays = allDays.slice(0, 7); 

    const subMenu = document.querySelector("#dayDropdown .sub-menu");
    subMenu.innerHTML = '';
    
    availableDays.forEach(dayKey => {
        const fullDayName = new Date(dayKey).toLocaleDateString("en-US", { weekday: "long" });
        
        const dropdownItem = document.createElement("div");
        dropdownItem.className = "dropdown-item";
        dropdownItem.innerHTML = `<p>${fullDayName}</p>`;
        
        dropdownItem.addEventListener('click', () => {
            dayDropdownSpan.textContent = fullDayName;
            updateHourlyForecast(dayKey);
        });
        
        subMenu.appendChild(dropdownItem);
    });
}

window.onload = getCoordsAndWeather;
