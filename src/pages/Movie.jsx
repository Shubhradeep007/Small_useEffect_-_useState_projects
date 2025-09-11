import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Modal,
  Chip,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import TheatersIcon from '@mui/icons-material/Theaters';

// The API key provided in the prompt.
const API_KEY = "b97378615313211b4561d205315212d2";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: 2,
};

// Main Component for the Movie Explorer Application
export default function Movie() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('trending'); // 'trending', 'top_rated', or 'search'
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies from TMDB API
  const fetchMovies = async (filter, query = '') => {
    // This check now correctly looks for a placeholder value, not the actual key.
    if (API_KEY === "YOUR_TMDB_API_KEY") {
      setError("Please add your TMDB API key to the code.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMovies([]);

    let url = '';
    if (filter === 'trending') {
      url = `${API_URL}/trending/movie/week?api_key=${API_KEY}`;
    } else if (filter === 'top_rated') {
      url = `${API_URL}/movie/top_rated?api_key=${API_KEY}`;
    } else if (filter === 'search' && query) {
      url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    } else {
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.get(url);
      if (response.data.results && response.data.results.length > 0) {
        setMovies(response.data.results);
        setError(null); // Clear previous errors on a successful fetch
      } else {
        setError('No movies found for your search.');
        setMovies([]); // Ensure results are cleared
      }
    } catch (err) {
      setError('Failed to fetch movies. Please check your API key and network connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch trending movies on initial load
  useEffect(() => {
    fetchMovies('trending');
  }, []);

  // Handle form submission for searching
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) {
      setError('Please enter a movie title to search.');
      return;
    }
    setActiveFilter('search');
    fetchMovies('search', searchTerm);
  };
  
  // Handle filter button clicks
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setSearchTerm(''); // Clear search term when switching filters
    fetchMovies(filter);
  };

  const handleOpenModal = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <TheatersIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movie Explorer
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search and Filter Section */}
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search for a movie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="contained" sx={{ ml: 2, py: '15px' }}>Search</Button>
            </form>
            <Box>
                <Button variant={activeFilter === 'trending' ? 'contained' : 'outlined'} onClick={() => handleFilterClick('trending')}>Trending</Button>
                <Button variant={activeFilter === 'top_rated' ? 'contained' : 'outlined'} onClick={() => handleFilterClick('top_rated')} sx={{ ml: 1 }}>Top Rated</Button>
            </Box>
        </Paper>

        {/* Content Display */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" variant="h6" sx={{ mt: 8 }}>{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card onClick={() => handleOpenModal(movie)} sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'scale(1.03)', transition: 'transform 0.2s ease-in-out' } }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://placehold.co/500x750/cccccc/ffffff?text=No+Image'}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>{movie.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Rating: {movie.vote_average.toFixed(1)}/10</Typography>
                    <Typography variant="body2" color="text.secondary">Released: {movie.release_date}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Movie Details Modal */}
        <Modal open={!!selectedMovie} onClose={handleCloseModal}>
            <Box sx={modalStyle}>
                {selectedMovie && (
                    <>
                        <Typography variant="h4" component="h2">{selectedMovie.title}</Typography>
                        <Typography sx={{ mt: 2 }}>{selectedMovie.overview}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1"><strong>Rating:</strong> {selectedMovie.vote_average.toFixed(1)}/10</Typography>
                            <Typography variant="body1"><strong>Release Date:</strong> {selectedMovie.release_date}</Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
      </Container>
    </Box>
  );
}

