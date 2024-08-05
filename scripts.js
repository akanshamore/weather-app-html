document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const locationInput = document.getElementById("locationInput");
    const weatherResult = document.getElementById("weatherResult");

    searchButton.addEventListener("click", function () {
        const location = locationInput.value;
        if (location) {
            fetchWeather(location);
        } else {
            alert("Please enter a location.");
        }
    });

    function fetchWeather(location) {

        fetch(`https://api.weatherapi.com/v1/current.json?key=d18416eb2baa45ba8d683638240508 &q=${location}`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherResult.innerHTML = `<p class="text-red-500">Error fetching weather data. Please try again.</p>`;
            });
    }

    function displayWeather(data) {
        weatherResult.innerHTML = `
            <h2 class="text-xl font-semibold">${data.location.name}, ${data.location.country}</h2>
            <p class="mt-2">Temperature: ${data.current.temp_c}°C</p>
            <p>Condition: ${data.current.condition.text}</p>
            <img src="${data.current.condition.icon}" alt="Weather icon" class="mt-2">
        `;
    }
});
