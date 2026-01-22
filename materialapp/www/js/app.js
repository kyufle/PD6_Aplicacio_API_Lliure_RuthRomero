function cargarClima() {
    const weatherContainer = document.getElementById('news-container');
    const LAT = '41.3887';
    const LON = '2.1589';
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Error de conexión');
            return response.json();
        })
        .then(data => {
            const daily = data.daily;
            if (!weatherContainer) return;

            weatherContainer.innerHTML = ''; 

            daily.time.forEach((date, index) => {
                const infoClima = traducirCodigoClima(daily.weathercode[index]);
                const cardHTML = `
                    <div class="col s12 m6 l4">
                        <div class="news-card card-style hoverable">
                            <div class="card-image-box center-align" style="background: #e3f2fd; padding: 20px; font-size: 50px;">
                                ${infoClima.icono}
                            </div>
                            <div class="card-content-area center-align">
                                <span class="card-title-text">${formatearFecha(date)}</span>
                                <h5 style="color: #1976d2; margin: 10px 0;">${daily.temperature_2m_max[index]}°C / ${daily.temperature_2m_min[index]}°C</h5>
                                <p><strong>${infoClima.texto}</strong></p>
                                <p style="color: #666;">Lluvia: ${daily.precipitation_probability_max[index]}%</p>
                            </div>
                        </div>
                    </div>`;
                weatherContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            if(weatherContainer) weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        });
}


function formatearFecha(fechaStr) {
    const opciones = { weekday: 'long', day: 'numeric', month: 'short' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
}

function traducirCodigoClima(code) {
    if (code === 0) return { texto: "Cielo despejado", icono: "☀️" };
    if (code >= 1 && code <= 3) return { texto: "Parcialmente nublado", icono: "⛅" };
    if (code >= 51 && code <= 67) return { texto: "Lluvia", icono: "🌦️" };
    if (code >= 95) return { texto: "Tormenta", icono: "⛈️" };
    return { texto: "Nublado", icono: "☁️" };
}