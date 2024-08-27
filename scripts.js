document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  const locationInput = document.getElementById("locationInput");
  const currentLocationButton = document.getElementById(
    "currentLocationButton"
  );
  const weatherResult = document.getElementById("weatherResult");
  const cityDropdown = document.getElementById("cityDropdown");

  // Load previously searched cities from localStorage
  loadCitiesFromLocalStorage();

  searchButton.addEventListener("click", function () {
    const location = locationInput.value;
    if (location) {
      fetchWeatherByLocation(location);
    } else {
      alert("Please enter a location.");
    }
  });

  currentLocationButton.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeatherByCoords, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  cityDropdown.addEventListener("change", function () {
    const selectedCity = cityDropdown.value;
    if (selectedCity) {
      fetchWeatherByLocation(selectedCity);
    }
  });

  function fetchWeatherByLocation(location) {
    const apiKey = "d18416eb2baa45ba8d683638240508";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.location) {
          saveCityToLocalStorage(data.location.name);
          displayWeather(data);
        } else {
          weatherResult.innerHTML = `<p class="text-red-500">Location not found. Please try again.</p>`;
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        weatherResult.innerHTML = `<p class="text-red-500">Error fetching weather data. Please try again.</p>`;
      });
  }

  function fetchWeatherByCoords(position) {
    const apiKey = "d18416eb2baa45ba8d683638240508";
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.location) {
          saveCityToLocalStorage(data.location.name);
          displayWeather(data);
        } else {
          weatherResult.innerHTML = `<p class="text-red-500">Location not found. Please try again.</p>`;
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        weatherResult.innerHTML = `<p class="text-red-500">Error fetching weather data. Please try again.</p>`;
      });
  }

  function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city)) {
      cities.push(city);
      localStorage.setItem("cities", JSON.stringify(cities));
      updateCityDropdown();
    }
  }

  function loadCitiesFromLocalStorage() {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      cityDropdown.appendChild(option);
    });
  }

  function updateCityDropdown() {
    cityDropdown.innerHTML =
      '<option value="" selected disabled>Select a previously searched city</option>';
    loadCitiesFromLocalStorage();
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
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
