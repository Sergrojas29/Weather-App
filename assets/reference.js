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
