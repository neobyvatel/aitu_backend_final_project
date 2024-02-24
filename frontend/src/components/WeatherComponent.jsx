import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";

const WeatherComponent = () => {
  const showToast = (message) =>
    toast.error(`${message}`, {
      position: "top-right",
      autoClose: 3500,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState({
    updateTime: "10:38",
    placeholderValue: "Search for a city",
    city: "City, Country",
    temp: "--°C",
    minTemp: "--°C",
    maxTemp: "--°C",
    feelsLike: "--°C",
    windSpeed: "-- m/s",
    windDirection: "direction: --",
    pressure: "--",
    humidity: "--%",
    weatherDescription: "description",
    sunrise: "--",
    sunset: "--",
    currentDate: getCurrentDate(),
  });
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFetchWeather();
    }
  };
  function getCurrentDate() {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
  }
  const handleCityNameChange = (e) => {
    setCityName(e.target.value);
  };
  const generateWeatherUrl = (cityName, endpoint) => {
    const key = "e31236ca2959caf5178b8298a93073e8";
    const lang = "en";
    const units = "metric";
    const baseUrl = "https://api.openweathermap.org/data/2.5";
    // return `https://invalid-url-for-testing/${endpoint}?city=${cityName}`;
    return `${baseUrl}/${endpoint}?q=${cityName}&appid=${key}&lang=${lang}&units=${units}`;
  };

  const handleFetchWeather = async () => {
    if (cityName.trim() === "") {
      showToast("Invalid input. Enter a city name.");
      return;
    }
    setCityName("");
    try {
      let urls = [
        generateWeatherUrl(cityName, "weather"),
        generateWeatherUrl(cityName, "forecast"),
      ];
      let requests = urls.map((url) => fetch(url));

      const responses = await Promise.all(requests);
      const data = await Promise.all(
        responses.map(async (response) => {
          const jsonData = await response.json();
          if (response.ok) {
            return jsonData;
          } else {
            throw new Error(jsonData.message || "Error fetching data");
          }
        })
      );

      if (data[0] && data[1]) {
        showWeather(data[0], data[1]);
      }
    } catch (error) {
      showToast(`Error fetching data: ${error.message}`);
      console.error(`Error fetching data: ${error}`);
    }
  };

  function showWeather(currentWeatherData, forecastData) {
    console.log("Forecast Data:", forecastData);
    console.log("Current Weather:", currentWeatherData);
    if (currentWeatherData.cod === "404") {
      showToast("City not found. ");
      return;
    }

    // Display current weather data
    if (currentWeatherData && currentWeatherData.sys) {
      setWeatherData({
        updateTime: getCurrentTime(),
        placeholderValue: `${currentWeatherData.name}, ${currentWeatherData.sys.country}`,
        city: `${currentWeatherData.name}, ${currentWeatherData.sys.country}`,
        temp: `${Math.round(currentWeatherData.main.temp)}°C`,
        minTemp: `${Math.round(currentWeatherData.main.temp_min)}°C`,
        maxTemp: `${Math.round(currentWeatherData.main.temp_max)}°C`,
        feelsLike: `${currentWeatherData.main.feels_like}°C`,
        windSpeed: `${currentWeatherData.wind.speed} m/s`,
        windDirection: `${currentWeatherData.wind.deg}°`,
        weatherDescription: currentWeatherData.weather[0].description,
        humidity: `${currentWeatherData.main.humidity}%`,
        pressure: `${currentWeatherData.main.pressure} hPa`,
        sunrise: formatTimeFromTimestamp(currentWeatherData.sys.sunrise),
        sunset: formatTimeFromTimestamp(currentWeatherData.sys.sunset),
        currentDate: getCurrentDate(),
      });
    }
    if (forecastData && forecastData.list) {
      const labels = [];
      const data = [];
      forecastData.list.forEach((item) => {
        labels.push(formatTimeFromTimestamp(item.dt));
        data.push(item.main.temp);
      });
      setChartData({
        labels,
        datasets: [
          {
            label: "Temperature",
            data,
            fill: false,
            borderColor: "#D0BCFF",
            borderWidth: 2,
          },
        ],
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#000000", // Set Y-axis tick font color to white
              },
            },
            x: {
              ticks: {
                color: "white", // Set X-axis tick font color to white
              },
            },
          },
          responsive: true,
        },
      });
    }
  }
  function getCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  }

  function formatTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  }

  // State for random line chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        fill: false,
        borderColor: "#D0BCFF",
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#000000", // Set Y-axis tick font color to white
          },
        },
        x: {
          ticks: {
            color: "white", // Set X-axis tick font color to white
          },
        },
      },
      responsive: true,
    },
  });

  return (
    <section id="weather-area" className="text-neutral-100">
      <ToastContainer
        position="top-right"
        autoClose={3500}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex w-full justify-center p-7">
        <form className="mx-auto mb-10 mt-16 w-full lg:mx-0 lg:w-2/3">
          <label
            htmlFor="search"
            className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3">
              <svg
                className="h-4 w-4 text-gray-300 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              id="cityName"
              value={cityName}
              onKeyDown={handleEnterKeyPress}
              onChange={handleCityNameChange}
              className="block w-full rounded-xl border border-gray-300  bg-gray-100/20 p-4 ps-10 text-sm text-white backdrop-blur-lg backdrop-filter focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
              placeholder={weatherData.placeholderValue}
            />
            <button
              type="button"
              id="btnFetch"
              onClick={handleFetchWeather}
              className="absolute bottom-2.5 end-2.5 rounded-lg bg-[#D0BCFF] px-4 py-2 text-sm font-medium text-black transition-all hover:bg-[#bfa3ff] focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="px-7 text-gray-200">
        <h1 className="text-5xl font-semibold">{weatherData.city}</h1>
        <p className="text-xl">
          {weatherData.currentDate}, {weatherData.updateTime}
        </p>
      </div>
      <div className="flex flex-col gap-6 p-7 xl:flex-row">
        <div className="flex flex-1 items-center justify-center gap-2 py-16">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9em"
              height="9em"
              viewBox="0 0 30 30"
            >
              <path
                fill="currentColor"
                d="M3.89 17.6c0-.99.31-1.88.93-2.65s1.41-1.27 2.38-1.49c.26-1.17.85-2.14 1.78-2.88c.93-.75 2-1.12 3.22-1.12c1.18 0 2.24.36 3.16 1.09c.93.73 1.53 1.66 1.8 2.8h.27c1.18 0 2.18.41 3.01 1.24s1.25 1.83 1.25 3c0 1.18-.42 2.18-1.25 3.01s-1.83 1.25-3.01 1.25H8.16c-.58 0-1.13-.11-1.65-.34s-.99-.51-1.37-.89c-.38-.38-.68-.84-.91-1.36s-.34-1.09-.34-1.66zm1.45 0c0 .76.28 1.42.82 1.96s1.21.82 1.99.82h9.28c.77 0 1.44-.27 1.99-.82c.55-.55.83-1.2.83-1.96s-.27-1.42-.83-1.96c-.55-.54-1.21-.82-1.99-.82h-1.39c-.1 0-.15-.05-.15-.15l-.07-.49c-.1-.94-.5-1.73-1.19-2.35s-1.51-.93-2.45-.93c-.94 0-1.76.31-2.46.94c-.7.62-1.09 1.41-1.18 2.34l-.07.42c0 .1-.05.15-.16.15l-.45.07c-.72.06-1.32.36-1.81.89c-.46.53-.71 1.16-.71 1.89zm8.85-8.72c-.1.09-.08.16.07.21c.43.19.79.37 1.08.55c.11.03.19.02.22-.03c.61-.57 1.31-.86 2.12-.86s1.5.27 2.1.81c.59.54.92 1.21.99 2l.09.64h1.42c.65 0 1.21.23 1.68.7s.7 1.02.7 1.66c0 .6-.21 1.12-.62 1.57s-.92.7-1.53.77c-.1 0-.15.05-.15.16v1.13c0 .11.05.16.15.16c1.01-.06 1.86-.46 2.55-1.19s1.04-1.6 1.04-2.6c0-1.06-.37-1.96-1.12-2.7c-.75-.75-1.65-1.12-2.7-1.12h-.15c-.26-1-.81-1.82-1.65-2.47c-.83-.65-1.77-.97-2.8-.97c-1.4-.01-2.57.52-3.49 1.58z"
              ></path>
            </svg>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-6xl font-semibold">{weatherData.temp}</p>
            <p className="text-xl font-semibold">
              {weatherData.weatherDescription}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-neutral-100/10 text-xl font-thin tracking-wider backdrop-blur-lg backdrop-filter ">
          <div className="flex flex-col sm:flex-row [&>*]:flex [&>*]:flex-col [&>*]:items-center [&>*]:p-16">
            <div>
              <p className="font-semibold">{weatherData.maxTemp}</p>
              <p>Hight</p>
            </div>
            <div>
              <p className="font-semibold">{weatherData.windSpeed}</p>
              <p>Wind</p>
            </div>
            <div>
              <p className="font-semibold">{weatherData.sunrise}</p>
              <p>Sunrise</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row [&>*]:flex [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:p-16">
            <div>
              <p className="font-semibold">{weatherData.minTemp}</p>
              <p>Low</p>
            </div>
            <div>
              <p className="font-semibold">{weatherData.humidity}</p>
              <p>Humidity</p>
            </div>
            <div>
              <p className="font-semibold">{weatherData.sunset}</p>
              <p>Sunset</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-7">
        <h1 className="text-5xl font-semibold">Five days forecast:</h1>
        <Chart type="line" data={chartData} className="p-8" />
      </div>
    </section>
  );
};
export default WeatherComponent;
