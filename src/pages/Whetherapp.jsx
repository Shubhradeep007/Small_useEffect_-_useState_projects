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


// import { useState } from "react";
// import Api from "../api/Api"; 


// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
//   Stack,
//   Grow,
// } from "@mui/material";


// import SearchIcon from "@mui/icons-material/Search";
// import WbSunnyIcon from '@mui/icons-material/WbSunny';
// import CloudIcon from '@mui/icons-material/Cloud';
// import GrainIcon from '@mui/icons-material/Grain'; 
// import AcUnitIcon from '@mui/icons-material/AcUnit'; 

// const Weatherapp = () => {
//   const apiKey = "c956e08fecb890c002b1d2aa0472c72a"; 

//   const [formData, setFormData] = useState({ cityInput: "" });
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name] || errors.apiError) {
//       setErrors({});
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.cityInput.trim()) {
//       newErrors.cityInput = "City name is required!";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  

//   const getWeatherIcon = (weatherCondition) => {
//     if (!weatherCondition) return null;
//     const main = weatherCondition.toLowerCase();
//     if (main.includes("clear")) return <WbSunnyIcon sx={{ fontSize: 80, color: '#FFD700' }} />;
//     if (main.includes("clouds")) return <CloudIcon sx={{ fontSize: 80, color: '#B0C4DE' }} />;
//     if (main.includes("rain") || main.includes("drizzle")) return <GrainIcon sx={{ fontSize: 80, color: '#778899' }} />;
//     if (main.includes("snow")) return <AcUnitIcon sx={{ fontSize: 80, color: '#ADD8E6' }} />;
//     return null;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setWeatherData(null);
//     if (!validate()) return;

//     setLoading(true);
//     setErrors({});

//     try {
//       const res = await Api.get(
//         `https://api.openweathermap.org/data/2.5/weather?q=${formData.cityInput}&units=metric&appid=${apiKey}`
//       );
//       setWeatherData(res.data);
//     } catch (error) {
//       setErrors({ apiError: "City not found. Please check the spelling." });
//       console.error("API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         p: 2,
//       }}
//     >
//       <Card
//         sx={{
//           minWidth: 300,
//           maxWidth: 500,
//           p: 3,
//           // --- Glassmorphism Effect ---
//           background: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(10px)",
//           borderRadius: "20px",
//           border: "1px solid rgba(255, 255, 255, 0.2)",
//           boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
//         }}
//       >
//         <CardContent>
//           <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>
//             AstroWeather
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
//               <TextField
//                 id="cityInput"
//                 name="cityInput"
//                 label="Enter City"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.cityInput}
//                 onChange={handleChange}
//                 error={!!errors.cityInput}
//                 helperText={errors.cityInput}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
//                     '&:hover fieldset': { borderColor: 'white' },
//                   },
//                   '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
//                   input: { color: 'white' }
//                 }}
//               />
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={loading}
//                 sx={{
//                   py: '15px',
//                   px: 3,
//                   background: 'rgba(255, 255, 255, 0.3)',
//                   '&:hover': { background: 'rgba(255, 255, 255, 0.5)' }
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
//               </Button>
//             </Stack>
//           </Box>
//         </CardContent>
//       </Card>
      
      
//       <Box sx={{ mt: 4, minHeight: 250, textAlign: 'center' }}>
//         {errors.apiError && <Alert severity="error">{errors.apiError}</Alert>}
        
//         {weatherData && (
//           <Grow in={true} timeout={1000}>
//             <Box>
//               {getWeatherIcon(weatherData.weather[0].main)}
//               <Typography variant="h3" sx={{ fontWeight: 600 }}>
//                 {weatherData.name}, {weatherData.sys.country}
//               </Typography>
//               <Typography variant="h2" sx={{ fontWeight: 'bold', my: 1 }}>
//                 {Math.round(weatherData.main.temp)}°C
//               </Typography>
//               <Typography variant="h5" sx={{ textTransform: 'capitalize', color: 'rgba(255, 255, 255, 0.8)' }}>
//                 {weatherData.weather[0].description}
//               </Typography>
//             </Box>
//           </Grow>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Weatherapp;