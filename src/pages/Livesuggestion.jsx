import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Box,
  List,
  ListItem,
} from "@mui/material";

const WordSuggest = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setError(null);
      return;
    }

    const timerId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://api.datamuse.com/sug?s=${query}`
        );

        if (response.data.length === 0) {
          setSuggestions([]);
        } else {
          setSuggestions(response.data);
        }
      } catch (err) {
        setError("An error occurred while fetching suggestions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [query]);

  const handleSuggestionClick = (word) => {
    setQuery(word);
    setSuggestions([]);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Live Word Suggestions
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Start typing a word..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {suggestions.length > 0 && !loading && (
          <Paper sx={{ mt: 1, border: "1px solid #ddd" }} elevation={0}>
            <List>
              {suggestions.map((suggest) => (
                <ListItem
                  button
                  key={suggest.word}
                  onClick={() => handleSuggestionClick(suggest.word)}
                >
                  {suggest.word}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default WordSuggest;
