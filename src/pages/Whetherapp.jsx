import { useState } from "react";

import Api from "../api/Api";

const Weatherapp = () => {
  const apiKey = "c956e08fecb890c002b1d2aa0472c72a";

  const [formData, setFormData] = useState({
    cityInput: "",
  });

  const [weatherData, setWeatherData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.cityInput.trim()) {
      newErrors.cityInput = "City name is required!";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setWeatherData(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    setErrors({});

    try {
      const res = await Api.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${formData.cityInput}&units=metric&appid=${apiKey}`
      );

      setWeatherData(res.data);
    } catch (error) {
      setErrors({ apiError: "City not found. Please try again." });

      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="cityInput">City: &nbsp;</label>
          <input
            type="text"
            id="cityInput"
            name="cityInput"
            value={formData.cityInput}
            onChange={handleChange}
            placeholder="Enter a city"
          />
          &nbsp;
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check"}
          </button>
          {errors.cityInput && (
            <p style={{ color: "red" }}>{errors.cityInput}</p>
          )}
        </form>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {loading && <p>Loading....</p>}
        {errors.apiError && <p style={{ color: "red" }}>{errors.apiError}</p>} 
        {weatherData && (
          <div>
            <h2>
              {weatherData.name}, {weatherData.sys.country} 
            </h2>

            <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
            <p>Condition: {weatherData.weather[0].description}</p>
            <p>
              Coordinates: Lat: {weatherData.coord.lat}, Lon:
              {weatherData.coord.lon}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weatherapp;
