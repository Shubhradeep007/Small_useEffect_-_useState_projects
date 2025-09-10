import axios from "axios";
import { useEffect, useRef, useState } from "react";

// --- Material-UI Imports ---
import {
  Container,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew"; // An icon for the button

const Randomjoke = () => {
  const [joke, setJoke] = useState({}); // store the data 
  const [countdown, setCountdown] = useState(10); // set coundown
  const [loading, setLoading] = useState(true); // Start with loading true
  const jokeIntervalRef = useRef(null); // refernce variable 

  const fetchData = async () => {
    try {
      setLoading(true);
      setCountdown(10);
      const res = await axios.get(
        `https://official-joke-api.appspot.com/random_joke`
      );
      setJoke(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextJokeClick = () => {
    clearInterval(jokeIntervalRef.current);
    fetchData();
    jokeIntervalRef.current = setInterval(fetchData, 10000);
  };

  useEffect(() => {
    fetchData();
    
    jokeIntervalRef.current = setInterval(fetchData, 10000);
    
    // descrise timer 
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);
    return () => {
      clearInterval(jokeIntervalRef.current);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    // Use Container to center content nicely
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ textAlign: "center", p: 2 }}>
        <CardContent>
          {/* Stack helps with vertical layout and spacing */}
          <Stack spacing={3} alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
              Random Jokes Generator 🃏
            </Typography>

            <Button
              variant="contained"
              onClick={handleNextJokeClick}
              disabled={loading}
              startIcon={<AutorenewIcon />}
              
            >
              Get New Joke
            </Button>

            {/* Display a CircularProgress spinner while loading */}
            {loading ? (
              <Box sx={{ height: 120, display: 'flex', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              // This Box provides a consistent height whether the joke is loaded or not
              <Box sx={{ minHeight: 120 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Next joke in {countdown} seconds...
                </Typography>
                <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                  {joke?.setup}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {joke?.punchline}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Randomjoke;