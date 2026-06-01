// --- DOM Elements ---
const DOM = {
    todayTemp: document.getElementById("today-temp"),
    city: document.getElementById("city-name"),
    searchInput: document.getElementById("search-input"),
    searchBtn: document.getElementById("search-btn"),
    todayCard: document.getElementById("today-card"),
};

// --- API Service Module ---
const WeatherService = {
    /**
     * Fetches geographical coordinates for a given city name.
     */
    async getCoordinates(cityName) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&format=json`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Geocoding service unavailable.");
        
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error(`City "${cityName}" not found.`);
        }
        
        return data.results[0];
    },

    /**
     * Fetches current weather data using latitude and longitude.
     */
    async getWeather(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Weather service unavailable.");
        
        const data = await response.json();
        return {
            temp: Math.floor(data.current.temperature_2m),
            unit: data.current_units.temperature_2m
        };
    }
};

// --- UI & Event Handlers ---
async function handleSearch() {
    const cityName = DOM.searchInput.value.trim();
    if (!cityName) return;

    // Reset UI or show a loading state
    DOM.todayTemp.textContent = "--";
    DOM.todayCard.innerHTML= `<div class="loading-div">
        <img src="images/icon-loading.svg" alt="loading icon">
        <p>Loading...</p>
        </div>
        `;

    try {
        // 1. Get Location
        const location = await WeatherService.getCoordinates(cityName);
        const { latitude, longitude, name, country } = location;
        const displayName = country ? `${name}, ${country}` : name;

        // 2. Get Weather
        const { temp, unit } = await WeatherService.getWeather(latitude, longitude);

        // 3. Update DOM
        DOM.todayCard.innerHTML = `
            <div>
             <h2 id="city-name">${displayName}</h2>
            <p></p>
            <div class="today-temp-div">
                <img src="" alt="">
                <span id="today-temp">${temp}${unit}</span>
             </div>
        `;
        
        
        DOM.todayCard.classList.remove("skeleton");

    } catch (error) {
        console.error("Weather App Error:", error);
        DOM.city.textContent = error.message;
        DOM.todayTemp.textContent = "";
    }
}

// --- Event Listeners ---
DOM.searchBtn.addEventListener("click", handleSearch);

DOM.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});