// ==========================================
// WEATHER DASHBOARD JAVASCRIPT
// ==========================================


// ==========================================
// API
// ==========================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ==========================================
// DOM ELEMENTS
// ==========================================

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const themeBtn =
    document.getElementById("themeBtn");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");

const weatherContent =
    document.getElementById("weatherContent");


// Location

const cityName =
    document.getElementById("cityName");

const locationDetails =
    document.getElementById("locationDetails");

const currentDate =
    document.getElementById("currentDate");

const currentTime =
    document.getElementById("currentTime");


// Current weather

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weatherDescription");

const feelsLike =
    document.getElementById("feelsLike");


// Metrics

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");


// Details

const windDirection =
    document.getElementById("windDirection");

const cloudCover =
    document.getElementById("cloudCover");

const precipitation =
    document.getElementById("precipitation");

const uvIndex =
    document.getElementById("uvIndex");


// Forecast

const forecastContainer =
    document.getElementById("forecastContainer");


// JSON

const jsonData =
    document.getElementById("jsonData");


// ==========================================
// VARIABLES
// ==========================================

let lastCity = "Indore";


// ==========================================
// WEATHER CODES
// ==========================================

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Rime Fog",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Slight Rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Slight Snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Slight Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy Thunderstorm",
            icon: "⛈️"
        }

    };


    return weatherCodes[code] || {

        description: "Unknown Weather",

        icon: "🌡️"

    };
}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    weatherContent.classList.add("hidden");

    errorBox.classList.add("hidden");
}


function hideLoading() {

    loading.classList.add("hidden");
}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    hideLoading();

    weatherContent.classList.add("hidden");

    errorMessage.textContent =
        message;

    errorBox.classList.remove("hidden");
}


function hideError() {

    errorBox.classList.add("hidden");
}


// ==========================================
// SEARCH CITY
// ==========================================

async function searchCity(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to connect to location service."
        );
    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `City "${city}" was not found.`
        );
    }


    return data.results[0];
}


// ==========================================
// FETCH WEATHER
// ==========================================

async function fetchWeather(
    latitude,
    longitude
) {

    const params =
        new URLSearchParams({

            latitude: latitude,

            longitude: longitude,

            current: [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "is_day",
                "precipitation",
                "weather_code",
                "cloud_cover",
                "pressure_msl",
                "wind_speed_10m",
                "wind_direction_10m"
            ].join(","),

            hourly: [
                "visibility",
                "uv_index"
            ].join(","),

            daily: [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max"
            ].join(","),

            timezone: "auto",

            forecast_days: "7"

        });


    const response =
        await fetch(
            `${WEATHER_API}?${params.toString()}`
        );


    if (!response.ok) {

        throw new Error(
            "Weather service is currently unavailable."
        );
    }


    return await response.json();
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// DAY NAME
// ==========================================

function getDayName(
    dateString,
    index
) {

    if (index === 0) {

        return "Today";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short"
        }
    );
}


// ==========================================
// CURRENT HOURLY INDEX
// ==========================================

function getCurrentHourIndex(
    weatherData
) {

    const currentTime =
        weatherData.current.time;


    const hourlyTimes =
        weatherData.hourly.time;


    const index =
        hourlyTimes.indexOf(
            currentTime
        );


    return index >= 0
        ? index
        : 0;
}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(
    location,
    data
) {

    const current =
        data.current;


    const info =
        getWeatherInfo(
            current.weather_code
        );


    // Location

    cityName.textContent =
        location.name;


    const region =
        location.admin1 || "";


    const country =
        location.country || "";


    locationDetails.textContent =
        `${region}${region && country ? ", " : ""}${country}`;


    // Date

    currentDate.textContent =
        formatDate(
            current.time
        );


    currentTime.textContent =
        formatTime(
            current.time
        );


    // Main weather

    weatherIcon.textContent =
        info.icon;


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    weatherDescription.textContent =
        info.description;


    feelsLike.textContent =
        `Feels like ${Math.round(
            current.apparent_temperature
        )}°C`;


    // Metrics

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    pressure.textContent =
        `${Math.round(
            current.pressure_msl
        )} hPa`;


    // Hourly index

    const hourIndex =
        getCurrentHourIndex(
            data
        );


    // Visibility

    if (
        data.hourly &&
        data.hourly.visibility
    ) {

        const visibilityMeters =
            data.hourly.visibility[
            hourIndex
            ];


        visibility.textContent =
            `${(
                visibilityMeters / 1000
            ).toFixed(1)} km`;
    }


    // Extra details

    windDirection.textContent =
        `${Math.round(
            current.wind_direction_10m
        )}°`;


    cloudCover.textContent =
        `${current.cloud_cover}%`;


    precipitation.textContent =
        `${current.precipitation} mm`;


    if (
        data.hourly &&
        data.hourly.uv_index
    ) {

        const uv =
            data.hourly.uv_index[
            hourIndex
            ];


        uvIndex.textContent =
            Number(uv).toFixed(1);
    }


    // Forecast

    displayForecast(
        data.daily
    );


    // JSON

    jsonData.textContent =
        JSON.stringify(
            data,
            null,
            2
        );


    // Show dashboard

    weatherContent.classList.remove(
        "hidden"
    );
}


// ==========================================
// DISPLAY FORECAST
// ==========================================

function displayForecast(
    daily
) {

    forecastContainer.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const info =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">
                ${getDayName(
            daily.time[i],
            i
        )}
            </div>

            <div class="forecast-icon">
                ${info.icon}
            </div>

            <div class="forecast-description">
                ${info.description}
            </div>

            <div class="forecast-temp">
                ${Math.round(
            daily.temperature_2m_max[i]
        )}°C
            </div>

            <div class="forecast-min">
                ${Math.round(
            daily.temperature_2m_min[i]
        )}°C
            </div>

            <div class="forecast-rain">
                💧 ${daily
                .precipitation_probability_max[i]
            ?? 0
            }%
            </div>

        `;


        forecastContainer.appendChild(
            card
        );
    }
}


// ==========================================
// LOAD WEATHER
// ==========================================

async function loadWeather(
    city
) {

    try {

        showLoading();

        hideError();


        city =
            city.trim();


        if (!city) {

            throw new Error(
                "Please enter a city name."
            );
        }


        // Step 1
        // Search city

        const location =
            await searchCity(
                city
            );


        // Step 2
        // Fetch weather

        const weatherData =
            await fetchWeather(
                location.latitude,
                location.longitude
            );


        // Step 3
        // Display data

        displayWeather(
            location,
            weatherData
        );


        // Save city

        lastCity =
            location.name;


        localStorage.setItem(
            "lastWeatherCity",
            location.name
        );


    } catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        showError(
            error.message ||
            "Something went wrong."
        );


    } finally {

        hideLoading();
    }
}


// ==========================================
// THEME
// ==========================================

function applyTheme(
    theme
) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️";

        themeBtn.title =
            "Switch to light theme";

    } else {

        document.body.classList.remove(
            "dark"
        );

        themeBtn.textContent =
            "🌙";

        themeBtn.title =
            "Switch to dark theme";
    }


    localStorage.setItem(
        "weatherTheme",
        theme
    );
}


// ==========================================
// TOGGLE THEME
// ==========================================

themeBtn.addEventListener(
    "click",
    () => {

        const isDark =
            document.body.classList.contains(
                "dark"
            );


        applyTheme(
            isDark
                ? "light"
                : "dark"
        );

    }
);


// ==========================================
// SEARCH BUTTON
// ==========================================

searchBtn.addEventListener(
    "click",
    () => {

        loadWeather(
            cityInput.value
        );

    }
);


// ==========================================
// ENTER KEY
// ==========================================

cityInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            loadWeather(
                cityInput.value
            );

        }

    }
);


// ==========================================
// REFRESH
// ==========================================

refreshBtn.addEventListener(
    "click",
    () => {

        loadWeather(
            lastCity
        );

    }
);


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        // Theme

        const savedTheme =
            localStorage.getItem(
                "weatherTheme"
            );


        if (savedTheme) {

            applyTheme(
                savedTheme
            );

        } else {

            applyTheme(
                "light"
            );
        }


        // City

        const savedCity =
            localStorage.getItem(
                "lastWeatherCity"
            );


        if (savedCity) {

            cityInput.value =
                savedCity;

            lastCity =
                savedCity;

        } else {

            cityInput.value =
                "Indore";

            lastCity =
                "Indore";
        }


        // Load weather

        loadWeather(
            lastCity
        );

    }
);