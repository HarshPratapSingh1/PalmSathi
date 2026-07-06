import axios from "axios";

export async function getWeather(lat, lng) {
    const key = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`;
    const res = await axios.get(url);
    const { main, weather, rain } = res.data;
    return {
        tempC: main.temp,
        humidity: main.humidity,
        condition: weather[0].main,
        description: weather[0].description,
        rainMm: rain?.["1h"] || 0,
    };
}