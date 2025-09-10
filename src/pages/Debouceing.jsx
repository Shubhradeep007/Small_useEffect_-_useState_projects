import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";

const DebouncedSearch = () => {
  const [query, setQuery] = useState(""); // input
  const [results, setResults] = useState([]); // api data
  const [loading, setLoading] = useState(false);  // loader
  const [error, setErros] = useState(null); // error 

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timerId = setTimeout(async () => {
      setLoading(true);
      setErros(null);
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?title_like=${query}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErros("Some thing went wrong with the api.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Debounced Search
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          API call will only be made 500ms after you stop typing.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Search for a post title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error">
            {error}
          </Typography>
        )}
        <List>
          {results.length > 0
            ? results.map((post) => (
                <ListItem key={post.id} divider>
                  <ListItemText primary={post.title} />
                </ListItem>
              ))
            : query.trim() !== "" &&
              !loading && !error &&(
                <Typography sx={{ p: 2, textAlign: "center" }}>
                  No results found.
                </Typography>
              )}
        </List>
      </Paper>
    </Container>
  );
};

export default DebouncedSearch;
