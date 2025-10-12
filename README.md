# Weather Now: Dynamic Local Forecast App

## Overview

Weather Now is a dynamic, user-friendly web application designed to provide instant current weather conditions and a multi-day forecast. The app utilizes the OpenWeatherMap API and browser Geolocation to offer location-aware weather data, ensuring users see relevant information immediately upon load.

##🛠️ Technology Stack

 -HTML

 -CSS

 -Javascript(ES6+)

##✨ Features
1. Geolocation-Based Auto-Loading (On Load)
Automatic Detection: Uses the browser's Geolocation API to instantly detect the user's latitude and longitude upon page load.

Instant Data: Fetches and displays current weather and forecast data for the user's precise location without requiring any input.

Fallback: If the user denies location permission or the browser does not support Geolocation, the app defaults to showing weather for a major city (e.g., London) and notifies the user.

2. Comprehensive Current Weather Display
Location & Date: Displays the city name, country, and the current date/day.

Core Metrics: Shows the main temperature, accompanied by a dynamic weather icon representing current conditions (sunny, rainy, cloudy, etc.).

Detailed Metrics: Provides essential secondary information in small-card format:

"Feels Like" Temperature

Humidity (%)

Wind Speed (km/h)

Precipitation (mm)

3. Multi-Day Daily Forecast
5-Day Outlook: Presents the weather forecast for the next 5 days (excluding the current day).

Daily Summary: Each day card displays the abbreviated day name, a representative weather icon (based on the most frequent condition for that day), and the daily High and Low temperatures for easy comparison.

4. Interactive Hourly Forecast
Dynamic Day Selection: Users can select any day (including today) from the dropdown menu in the "Hourly forecast" section.

3-Hour Intervals: Displays detailed weather information in 3-hour increments for the selected day, reflecting the raw data provided by the OpenWeatherMap API.

Detailed Hourly View: Each hourly slot includes the time (e.g., "1 PM"), a specific weather icon, and the temperature.
