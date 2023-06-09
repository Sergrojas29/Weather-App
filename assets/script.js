function findsavedata() {
    var checkforsave = localStorage.getItem('savedCity')
    var RecentCity = {
        CityName: 'London',
        lat: 51.51,
        lon: -0.13,
    }
    if (!checkforsave) {
        localStorage.setItem('savedCity', JSON.stringify(RecentCity))
    }
    else {
        var recentcity = JSON.parse(localStorage.getItem('savedCity'))
        const recentlink = document.querySelector('#lastcity')
        recentlink.innerText = recentcity.CityName
    }

}
intialWeather()
setFiveDayLable()

function intialWeather() {
    findsavedata()
    var getSave = JSON.parse(localStorage.getItem("savedCity"))
    var url = `https://api.open-meteo.com/v1/forecast?latitude=${getSave.lat}&longitude=${getSave.lon}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York`
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setCityName()
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




var popularCity = {
    NewYorkCity: {
        CityName: 'New York City',
        lat: 40.71,
        lon: -74.01,
    },
    HongKong: {
        CityName: 'Hong Kong',
        lat: 22.27,
        lon: 114.18,
    },
    Paris: {
        CityName: 'Paris',
        lat: 48.85,
        lon: 2.35,
    },
}

//! Button for city
var favCityLinks = document.querySelector("#favCity")
favCityLinks.addEventListener('click', function (event) {
    var citySelected = event.target.getAttribute('cityname')
    var mainCity = document.querySelector('#cityTitle')
    if (!citySelected) {
        console.log('None');
    }
    else {
        var latlatitude = popularCity[citySelected].lat
        var longitude = popularCity[citySelected].lon
        getTempertureforCity(latlatitude, longitude)
        mainCity.innerText = popularCity[citySelected].CityName
    }

})




const weatherCode = {
    W0: 'Clear sky',
    W1: 'Mainly clear',
    W2: 'Partly cloudy',
    W3: 'Overcast',
    W45: 'Fog',
    W48: 'Fog',
    W51: 'Drizzle',
    W53: 'Drizzle',
    W55: 'Drizzle',
    W56: 'Freezing Drizzle',
    W57: 'Freezing Drizzle',
    W61: 'Rain',
    W63: 'Rain',
    W65: 'Heavy Rain',
    W66: 'Freezing Rain',
    W67: 'Freezing Rain',
    W71: 'Snow',
    W73: 'Snow',
    W75: 'Snow',
    W77: 'Snow',
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



setDate()
function setDate() {
    var today = dayjs();

    var date = document.querySelector('#date')
    // var time = document.querySelector('#time')
    date.innerText = today.format('MMM DD, YYYY')
    // time.innerText = today.format('hh:mm A')

}

function setFiveDayLable() {
    const daysOfTheWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
    var today = dayjs().day() + 1
    var dayCard = document.querySelectorAll('.five_day_titles')
    var newweek = []
    console.log(dayCard);
    for (let i = today; i < (6 + today); i++) {
        if (i <= 6) {
            newweek.push(daysOfTheWeek[i])
        }
        else {
            newweek.push(daysOfTheWeek[(i - 7)])
        }
    }
    console.log(newweek);
    for (let i = 0; i < dayCard.length; i++) {
        let element = dayCard[i];
        element.innerText = newweek[i]

    }

};





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


function setCityName() {
    const mainCityName = document.querySelector('#cityTitle')
    mainCityName.innerText = JSON.parse(localStorage.getItem("savedCity")).CityName;


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


function getAverageTemperature(data, day) {
    var dayCard = document.querySelector('#day' + day).children[0].children[0]
    var high = data.daily.temperature_2m_max[day]
    var low = data.daily.temperature_2m_min[day]
    var averagetemp = Math.round((high + low) / 2)
    dayCard.innerText = averagetemp + '°F'
}

function getWeatherCode(data, day) {
    var dayCard = document.querySelector('#day' + day).children[1]
    var weatheLogo = document.querySelector('#day' + day).children[0].children[1]

    var getCode = 'W' + String(data.daily.weathercode[day])
    dayCard.innerText = weatherCode.findcode(getCode)

    var logoUrl = './assets/images/' + weatherCode.findcode(getCode) + '.png'
    weatheLogo.setAttribute('src', logoUrl)

}
function getHumidity(data, day) {
    var todayHour = Number(dayjs().format('HH'));
    var dayCard = document.querySelector('#day' + day).children[2]
    var addicon = document.createElement('span')
    addicon.setAttribute('class', 'material-symbols-outlined')
    addicon.innerText = 'humidity_percentage'
    //! Getting the Average of the 24 hour but minus the hours left of the day
    var hoursMin = (24 * day) - (1 + todayHour)
    var hoursMax = 24 + hoursMin
    var averageHumidity = 0
    for (let i = hoursMin; i < hoursMax; i++) {
        var getHumidity = data.hourly.relativehumidity_2m[i]
        averageHumidity += getHumidity
    }
    dayCard.textContent = Math.round(averageHumidity / 24) + '%'
    dayCard.appendChild(addicon)


}

function getWindSpeed(data, day) {
    var todayHour = Number(dayjs().format('HH'));

    var dayCard = document.querySelector('#day' + day).children[3]
    var addicon = document.createElement('span')
    addicon.setAttribute('class', 'material-symbols-outlined')
    addicon.innerText = 'air'
    var hoursMin = (24 * day) - (1 + todayHour)
    var hoursMax = 24 + hoursMin
    var averageWind = 0
    for (let i = hoursMin; i < hoursMax; i++) {
        var getWind = data.hourly.windspeed_10m[i]
        averageWind += getWind
    }
    dayCard.innerText = Math.round(averageWind / 24) + 'mph'
    dayCard.appendChild(addicon)

}


