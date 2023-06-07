const searchBar = document.querySelector('#citySearch')

// searchBar.addEventListener('keydown', geoSearch)

searchBar.addEventListener('keyup', function (event) {
    if (event.code == 'Enter') {
        geoSearch()
    }
})

function geoSearch() {
    fetch(searchSuggestions())
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setCityDate(data)
            getTempertureforCity(data.results[0].latitude, data.results[0].longitude)

            console.log(data)
            saveRecentData(data)

        });
}

function searchSuggestions() {
    var typedCity = searchBar.value.replace(' ', '+')
    var geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${typedCity}&count=4&language=en&format=json`
    return geoURL
}

function setCityDate(data) {
    const cityTitle = document.querySelector('#cityTitle')
    cityTitle.innerText = data.results[0].name
}


function getTempertureforCity(latitude, longitude) {
    var cityURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York`
    fetch(cityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            MainWeather(data)
            for (let i = 1; i < 6; i++) {
                getAverageTemperature(data, i)
                getWeatherCode(data, i)
                getHumidity(data, i)
                getWindSpeed(data, i)
                // fiveDaySet(i)
            }
        });

}


function saveRecentData(data){
    var RecentCity = {
        CityName:'',
        lat: 0,
        lon: 0
    }
    RecentCity.CityName = data.results[0].name
    RecentCity.lat = data.results[0].latitude
    RecentCity.log = data.results[0].longitude

    localStorage.setItem('savedCity', JSON.stringify(RecentCity))
    console.log(RecentCity);

}