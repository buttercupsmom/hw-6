// Variables save to local storage
// const searchHistory = //get items from local storage, as a global variable at the top

const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// functions

function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There was a problem with the response");
      }
    })

    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data.current, city);
      displayFiveDayWeather(data.daily);
    });
}

function displayCurrentWeather(currentCityData, cityName) {
  // Displays Current City and Weather
  let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;

  // Handles light around UVI
  let uvIndex;
  if (currentCityData.uvi < 3) {
    uvIndex = "green";
  } else if (currentCityData.uvi < 5) {
    uvIndex = "yellow";
  } else if (currentCityData.uvi < 8) {
    uvIndex = "red";
  }
  // Displays City, Temp, Icon, Wind, Humidity, and UVI
  document.querySelector(
    "#currentWeather"
  ).innerHTML = `<h2>${cityName} ${moment
    .unix(currentCityData.dt)
    .format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${
    currentCityData.temp
  } \xB0F <br></br> Wind: ${
    currentCityData.wind_speed
  } Mph <br></br> Humidity: ${
    currentCityData.humidity
  } %<br></br> UV Index: <span class=${uvIndex}>${
    currentCityData.uvi
  }</span></div>`;
}

function displayFiveDayWeather(fiveDayCityData) {
  const cityData = fiveDayCityData.slice(1, 6);
  document.querySelector("#fiveDayWeather").innerHTML = "";

  cityData.forEach((day) => {
    // Displays icon with corresponding weather
    let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    // Displays Five Day
    document.querySelector(
      "#fiveDayWeather"
    ).innerHTML += `<div class="forecastcard"><div>${moment
      .unix(day.dt)
      .format(
        "MMM Do YY"
      )}</div> <div><img src="${weatherIcon}"></div> <div>Temp: ${
      day.temp.day
    } \xB0F</div> <div>Wind: ${day.wind_speed} Mph</div> <div>Humidity: ${
      day.humidity
    } %</div></div>`;
  });
}

function handleFormSubmit(event) {
  // Handles search history
  document.querySelector("#searchHistory").innerHTML = "";
  event.preventDefault();
  const city = document.querySelector("#searchInput").value.trim();
  searchHistory.push(city);
  // No duplicated searches when search button is clicked
  const filteredSearchHistory = searchHistory.filter((city, index) => {
    return searchHistory.indexOf(city) === index;
  });
  localStorage.setItem("searchHistory", JSON.stringify(filteredSearchHistory));
  filteredSearchHistory.forEach((city) => {
    document.querySelector(
      "#searchHistory"
    ).innerHTML += `<button data-city="${city}" class="w-100 d-block my-2 btn-secondary history-button">${city}</button>`;
  });
  handleCoords(city);
}

function handleHistory(event) {
  const city = event.target.getAttribute("data-city");
  handleCoords(city);
}

// listeners
// on page load, show any past cities searched
// search for city
// click on city to show weather
document
  .querySelector("#searchForm")
  .addEventListener("submit", handleFormSubmit);
document
  .querySelector("#searchHistory")
  .addEventListener("click", handleHistory);
