"use client";

import Link from "next/link";

const fetchForecast = async () => {
  try {
    const response = await fetch(process.env.WEATHER_API_URL);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
};

const formatDate = (date) => {
  const options = { month: "long", day: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  return `${formattedDate}`;
};

const formatTime = (time) => {
  const options = { hour: "numeric", hour12: true };
  return new Date(`1970-01-01T${time.slice(-5)}`).toLocaleTimeString(
    undefined,
    options
  );
};

export default async function Weather() {
  const weatherData = await fetchForecast();
  const currentTime = new Date().toISOString().slice(0, 16);

  return (
    <>
      <Link href="/">Home</Link>
      <h2>Forecast</h2>

      <ul>
        {weatherData.forecast.forecastday.slice(1, 4).map((day) => (
          <li key={day.date}>
            {day.hour
              .filter((hour, index) => {
                const forecastTime = `${hour.time}`;
                return forecastTime > currentTime && index % 3 === 0;
              })
              .map((hour) => (
                <div key={hour.time_epoch}>
                  <h4>{formatDate(day.date)}</h4>
                  <h4>{formatTime(hour.time)}</h4>
                  <p>Condition: {hour.condition.text}</p>
                  <p>Temperature: {hour.temp_c}°C</p>
                  <img src={hour.condition.icon} alt="Weather Icon" />
                  <p>Precipitation: {hour.precip_mm} mm</p>
                  <p>Wind Speed: {hour.wind_kph} km/h</p>
                </div>
              ))}
          </li>
        ))}
      </ul>
    </>
  );
}
