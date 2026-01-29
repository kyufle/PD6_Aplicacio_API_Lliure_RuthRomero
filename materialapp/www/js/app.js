function loadWeather() {
    const weatherContainer = document.getElementById('news-container');
    const LAT = '41.3887';
    const LON = '2.1589';
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Error de connexió');
            return response.json();
        })
        .then(data => {
            const daily = data.daily;
            if (!weatherContainer) return;

            weatherContainer.innerHTML = ''; 

            daily.time.forEach((date, index) => {
                const weatherInfo = translateWeatherCode(daily.weathercode[index]);
                
                // Enllaç a AccuWeather per Barcelona
                // El paràmetre 'day' (index + 1) ens porta al dia correcte de la llista
                const dayUrl = `https://www.accuweather.com/ca/es/barcelona/307297/daily-weather-forecast/307297?day=${index + 1}`;

                const cardHTML = `
                    <div class="col s12 m6 l4">
                        <a href="${dayUrl}" target="_blank" style="text-decoration: none; color: inherit;">
                            <div class="news-card card-style hoverable" style="cursor: pointer; border: 1px solid #eee; margin-bottom: 15px; border-radius: 15px; background: white; transition: 0.3s;">
                                <div class="card-image-box center-align" style="background: #f8fbff; padding: 25px; font-size: 50px; text-align: center;">
                                    ${weatherInfo.icon}
                                </div>
                                <div class="card-content-area center-align" style="padding: 20px; text-align: center;">
                                    <span style="display: block; font-weight: bold; color: #555; text-transform: capitalize; font-size: 20px;">${formatDate(date)}</span>
                                    <h4 style="color: #0288d1; margin: 10px 0;">${daily.temperature_2m_max[index]}° / ${daily.temperature_2m_min[index]}°</h4>
                                    <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>${weatherInfo.text}</strong></p>
                                    <div style="background: #e1f5fe; border-radius: 20px; padding: 5px 10px; display: inline-block; color: #01579b; font-size: 0.85rem;">
                                        💧 Probabilitat: ${daily.precipitation_probability_max[index]}%
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`;
                weatherContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            if(weatherContainer) weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

function formatDate(dateStr) {
    const options = { weekday: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('ca-ES', options);
}

function translateWeatherCode(code) {
    if (code === 0) return { text: "Cel serè", icon: "☀️" };
    if (code >= 1 && code <= 3) return { text: "Clarobscurs", icon: "⛅" };
    if (code >= 51 && code <= 67) return { text: "Pluja", icon: "🌧️" };
    if (code >= 71 && code <= 77) return { text: "Neu", icon: "❄️" };
    if (code >= 95) return { text: "Tempesta", icon: "⛈️" };
    return { text: "Ennuvolat", icon: "☁️" };
}

loadWeather();