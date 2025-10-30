import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
const apiKey = import.meta.env.VITE_SOME_KEY

const sampleResponse = {
  coord: { lon: -0.13, lat: 51.51 },
  weather: [
    {
      id: 300,
      main: "Drizzle",
      description: "light intensity drizzle",
      icon: "09d",
    },
  ],
  base: "stations",
  main: {
    temp: 28.32,
    pressure: 1012,
    humidity: 81,
    temp_min: 27.15,
    temp_max: 28.15,
  },
  visibility: 10000,
  wind: { speed: 4.1, deg: 80 },
  clouds: { all: 90 },
  dt: 1485789600,
  sys: {
    type: 1,
    id: 5091,
    message: 0.0103,
    country: "GB",
    sunrise: 1485762037,
    sunset: 1485794875,
  },
  id: 2643743,
  name: "London",
  cod: 200,
};


const getWeather = ({city}) => {
    console.log('city ->', city)
    console.log('apiKey ->', apiKey)
    //const url = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${apiKey}`
    const sampleUrl = `https://samples.openweathermap.org/data/2.5/weather?q=London&appid=b1b15e88fa797225412429c1c50c122a1`
    // axios.get(sampleUrl)
    // .then(response => {
    //     console.log('response data ->', response.data)
    //     return addIconUrl(response.data)
    // })
    // .catch(error => {
    //     console.log('error ->', error)
    //     return addIconUrl(sampleResponse)
    // })
    return addIconUrl(fixFakeData(sampleResponse, city))
}

const fixFakeData = (weather, city) => {
    return {
        ...weather,
        name: city
    }
}

const addIconUrl = (weather) => {
    const icon = weather.weather[0].icon
    console.log('icon ->', icon)
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
    return {...weather, icon: iconUrl}
}

export default getWeather
