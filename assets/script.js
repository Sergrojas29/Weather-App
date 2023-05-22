// var cityLat = 39.36
// var cityLon = -74.42
// var apiKey = '2e7466d78093f0bfb89853f9a2edc0cc'
// var url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=' + apiKey
var url = 'https://api.open-meteo.com/v1/forecast?latitude=39.36&longitude=-74.42&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York'

var inputCity = 'Atlantic City'


const weatherCode = {
    W0: 'Clear sky',
    W1: 'Mainly clear',
    W2: 'Partly cloudy',
    W3: 'Overcast',
    W45: 'Fog ',
    W48: 'Fog',
    W51: 'Drizzle',
    W53: 'Drizzle',
    W55: 'Drizzle',
    W56: 'Freezing Drizzle',
    W57: 'Freezing Drizzle',
    W61: 'Rain',
    W63: 'Rain ',
    W65: 'Heavy Rain ',
    W66: 'Freezing Rain',
    W67: 'Freezing Rain',
    W71: 'Snow',
    W73: 'Snow',
    W75: 'Snow',
    W77: 'Snow grains',
    W80: 'Rain showers',
    W81: 'Rain showers',
    W82: 'Rain showers',
    W85: 'Snow showers',
    W86: 'Snow showers',
    W95: 'Thunderstorm',
    W96: 'Thunderstorm',
    W99: 'Thunderstorm',
    findcode: function (code) {
        return this[code]
    },
}




function setDate(day) {
    var today = dayjs();
    todayHour = Number(dayjs().format('HH'));
    var date = document.querySelector('#date')
    var time = document.querySelector('#time')
    date.innerText = today.format('MMM DD, YYYY')
    time.innerText = today.format('hh:MM A')
    return todayHour
}
setDate()

function fiveDaySet(day) {
    const daysOfTheWeek = { 
        W0: 'Sunday',
        W1: 'Monday',
        W2: 'Tuesday',
        W3: 'Wednesday',
        W4: 'Thursday',
        W5: 'Friday',
        W6: 'Saturday',
        findDay: function (code) {
            return this[code]
        },
    
    }
    var dayCard = document.querySelector('#day' + day).children[4]    
    var dayOfweeek = dayjs().day() + day
    var Objectfind = "W" + String(dayOfweeek)
    dayCard.innerText = daysOfTheWeek.findDay(Objectfind)
}

fetch(url)
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
            fiveDaySet(i)
        }
        console.log(data)
    });


function MainWeather(data) {

    const cityTitle = document.querySelector('#cityTitle')
    const mainTemp = document.querySelector('#main_temp_degrees')
    const mainHumidity = document.querySelector('#main_weather_Humidity')
    const mainDescription = document.querySelector('#main_weather_description')
    const mainWindSpeed = document.querySelector('#main_weather_Wind')


    var hourDescription = data.hourly.weathercode[todayHour]
    var hourTemperature = data.hourly.temperature_2m[todayHour]
    var hourHumidity = data.hourly.relativehumidity_2m[todayHour]
    var hourWind = data.hourly.windspeed_10m[todayHour]

    cityTitle.innerText = inputCity
    mainDescription.innerText = weatherCode.findcode('W' + String(hourDescription))
    mainTemp.innerText = hourTemperature + '°F'
    mainHumidity.innerText = hourHumidity
    mainWindSpeed.innerText = hourWind
}


function getAverageTemperature(data, day) {
    var dayCard = document.querySelector('#day' + day).children[0].children[0]
    var high = data.daily.temperature_2m_max[day]
    var low = data.daily.temperature_2m_min[day]
    var averagetemp = Math.round((high + low) / 2)
    dayCard.innerText = averagetemp + '°F'
}

function getWeatherCode(data, day) {
    var dayCard = document.querySelector('#day' + day).children[1]
    var getCode = 'W' + String(data.daily.weathercode[day])
    dayCard.innerText = weatherCode.findcode(getCode)

}
function getHumidity(data, day) {
    var dayCard = document.querySelector('#day' + day).children[2]
    var hoursMin = (24 * day) - 1
    var hoursMax = 24 + hoursMin
    var averageHumidity = 0
    for (let i = hoursMin; i < hoursMax; i++) {
        var getHumidity = data.hourly.relativehumidity_2m[i]
        averageHumidity += getHumidity
    }
    dayCard.innerText = 'Humidity: ' + Math.round(averageHumidity / 24) + '%'

}

function getWindSpeed(data, day) {
    var dayCard = document.querySelector('#day' + day).children[3]
    var hoursMin = (24 * day) - 1
    var hoursMax = 24 + hoursMin
    var averageWind = 0
    for (let i = hoursMin; i < hoursMax; i++) {
        var getWind = data.hourly.windspeed_10m[i]
        averageWind += getWind
    }
    dayCard.innerText = 'Wind: ' + Math.round(averageWind / 24) + 'mph'

}