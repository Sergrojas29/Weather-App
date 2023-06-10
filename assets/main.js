//! Get recent City names

const setrecentCity = () => {
    const savedRecentCity = localStorage.getItem('savedRecentCity')
    savedRecentCity ? printSaveddata() : createSavedData()
}
const createSavedData = () => {
    const popCity = ['london', 'paris', 'hong kong', 'new york',]
    localStorage.setItem('savedRecentCity', JSON.stringify(popCity))
    return 
}
function printSaveddata() {
    var recentEl = document.querySelectorAll('.city')
    const popCity = JSON.parse(localStorage.getItem('savedRecentCity'))
    let i = 0
    for (const el of recentEl) {
        el.innerText = popCity[i]
        i++
    }
    return
}
setrecentCity()
//! Add event listern for search bar
const citySearch = document.querySelector("#citySearch")
const autosearch = document.querySelector('#autosearch')
const citylink = document.querySelector('#favCity')

citySearch.addEventListener('keyup', (event) => {
    clear()
    if (event.key == 'Enter') {grabWeatherfromLatLon(firstResult[0], firstResult[1]); setCityName(firstResult[2]); saveNewcity()}
    else if (citySearch.value.length >= 2) {geoSearch(searchSuggestions())}
    
})

//!Autocomplete button to search
function createbuttonSearch(cityname, state, latitude, longitude) {
    const autosearchbtn = document.createElement('button')
    autosearchbtn.setAttribute('latitude', `${latitude}`)
    autosearchbtn.setAttribute('longitude', `${longitude}`)
    autosearchbtn.onclick = (event) => {
        let latitude = event.target.getAttribute('latitude')
        let longitude = event.target.getAttribute('longitude')
        grabWeatherfromLatLon(latitude, longitude);
        clear()
        setCityName(cityname)
        saveNewcity()
    }
    state ? autosearchbtn.innerText = `${cityname}, ${state}` : autosearchbtn.innerText = `${cityname}`
    autosearch.appendChild(autosearchbtn)
}

//! Link search and weather //! Get Weather from A links
citylink.addEventListener('click', (event) =>{
    const cityname = event.target.innerText
    // console.log(cityname.length);
    if(cityname.length < 15){
        geobycity(cityname)
    }
})


//!Remove Auto Search elements
function clear() {
    while (autosearch.firstChild) {
        autosearch.removeChild(autosearch.firstChild)
    }
}


//! Get lat and lon 
function geoSearch(searchtype) {
    fetch(searchtype)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (const iterator of data.results) {
                createbuttonSearch(iterator.name, iterator.admin1, iterator.latitude, iterator.longitude)
            }
            firstResult = [data.results[0].latitude, data.results[0].longitude, data.results[0].name]
            return firstResult
        });

}

function geobycity(cityname){
    var typedCity = cityname.replace(' ', '+')
    var geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${typedCity}&count=4&language=en&format=json`
    fetch(geoURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            let latitude = data.results[0].latitude
            let longitude = data.results[0].longitude
            setCityName(data.results[0].name)            
            var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York`
            fetch(url).then(response => {
                return response.json();
            }).then(data => {
                MainWeather(data)
                setFiveDay(data)
                saveNewcity()
            })
        })
}


function searchSuggestions() {
    var typedCity = citySearch.value.replace(' ', '+')
    var geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${typedCity}&count=4&language=en&format=json`
    return geoURL;
}

function linksearch(event){
    var typedCity = event.target.innerText.replace(' ', '+')
    var geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${typedCity}&count=4&language=en&format=json`
    return geoURL;
}
//! display weather for the city (lat and lon)

function grabWeatherfromLatLon(latitude, longitude) {
    var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York`
    fetch(url).then(response => {
        return response.json();
    }).then(data => {
        MainWeather(data)
        setFiveDay(data)
    })

}



function setCityName(name) {
    const mainCityName = document.querySelector('#cityTitle')
    mainCityName.innerText = name
    
}

function MainWeather(data) {
    const mainTemp = document.querySelector('#main_temp_degrees')
    const mainHumidity = document.querySelector('#main_weather_Humidity')
    const mainDescription = document.querySelector('#main_weather_description')
    const mainWindSpeed = document.querySelector('#main_weather_Wind')
    const mainLogo = document.querySelector('#mainLogo')

    var todayHour = Number(dayjs().format('HH'));
    var hourDescription = data.hourly.weathercode[todayHour]
    var hourTemperature = data.hourly.temperature_2m[todayHour]
    var hourHumidity = data.hourly.relativehumidity_2m[todayHour]
    var hourWind = data.hourly.windspeed_10m[todayHour]
    
    var logoUrl = './assets/images/' + weatherCode.findcode('W' + String(hourDescription)) + '.png'
    mainLogo.setAttribute('src', logoUrl)

    mainDescription.innerText = weatherCode.findcode('W' + String(hourDescription))
    mainTemp.innerText = Math.round(hourTemperature) + '°F'
    mainHumidity.innerText = hourHumidity
    mainWindSpeed.innerText = hourWind
}
function setFiveDay(data) {
    const todayHour = Number(dayjs().format('HH'));

    // spanElwindspeed.innerText = 'air'

    const hightemp = document.querySelectorAll('#hightemp')
    const lowtemp =  document.querySelectorAll('#lowtemp')
    const weather_description =  document.querySelectorAll('.weather_description')
    const LogopngFiveday = document.querySelectorAll('.LogopngFiveday')
    const humidity = document.querySelectorAll('#humidity')
    const windspeed = document.querySelectorAll('#windspeed')
    const five_day_titles = document.querySelectorAll('.five_day_titles')

    for (let i = 0; i < 5; i++) {
        var actualday = i + 1 
        hightemp[i].textContent = Math.round(data.daily.temperature_2m_max[actualday])
        lowtemp[i].textContent = Math.round(data.daily.temperature_2m_min[actualday])
        var weathercode =  weatherCode.findcode(`W${data.daily.weathercode[actualday]}`)
        weather_description[i].textContent = weathercode
        LogopngFiveday[i].setAttribute('src',`./assets/images/${weathercode}.png`)        
        humidity[i].textContent = data.hourly.relativehumidity_2m[todayHour + (actualday*24)]
        windspeed[i].textContent = data.hourly.windspeed_10m[todayHour + (actualday*24)]
        five_day_titles[i].textContent = dayjs.unix(data.daily.time[actualday]).format('MM-DD')        
    }


}


//! set new city data

function saveNewcity(){
    var cityarray = JSON.parse(localStorage.getItem('savedRecentCity'))
    var CityName = document.querySelector('#cityTitle').innerText   
    if(!cityarray.includes(CityName)){
    cityarray.pop()
    cityarray.unshift(CityName)
    localStorage.setItem('savedRecentCity', JSON.stringify(cityarray))
    setrecentCity()
    }

}



//todo add a auto complate search
//todo nice logos
//! 