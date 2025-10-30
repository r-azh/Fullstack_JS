const Weather = ({weather}) => {
    console.log(weather)
    if (!weather) {
        return <div>No weather data available</div>
    }
    return (
        <div>
            <h2>Weather in {weather.name}</h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Weather: {weather.weather[0].description}</p>
            <img src={weather.icon} alt={weather.weather[0].description} />
            <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather
