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
  Button,
  Stack,
  Divider,
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const PaginatedSearch = () => {
  // State for the search input
  const [query, setQuery] = useState("");
  // State for the current page number
  const [page, setPage] = useState(1);
  // State to hold the search results (posts)
  const [results, setResults] = useState([]);
  // State to determine if a "Next" page exists
  const [hasMore, setHasMore] = useState(false);
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function fetches data from the API based on the current query and page
  const fetchData = async (currentPage, currentQuery) => {
    if (currentQuery.trim() === "") {
      setResults([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?q=${currentQuery}&_page=${currentPage}&_limit=10`
      );
      
      setResults(response.data);
      // If we get back 10 items, we assume there's a next page
      setHasMore(response.data.length === 10);

    } catch (err) {
      setError("An error occurred while fetching posts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // This effect triggers a debounced search when the user types in the search box.
  // It always resets the search to page 1.
  useEffect(() => {
    setPage(1); // Reset to page 1 for every new search
    const timerId = setTimeout(() => {
      fetchData(1, query);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timerId);
  }, [query]);

  // Handler for the "Next" button
  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchData(newPage, query); // Fetch the next page immediately
  };

  // Handler for the "Previous" button
  const handlePrevPage = () => {
    const newPage = page - 1;
    setPage(newPage);
    fetchData(newPage, query); // Fetch the previous page immediately
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Paginated Post Search
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Search for posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        
        {!loading && !error && results.length === 0 && query && (
           <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            No results found for "{query}".
          </Typography>
        )}

        {results.length > 0 && !loading && (
          <List sx={{ mt: 2 }}>
            {results.map((post) => (
              <ListItem key={post.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h6" component="h3" sx={{ textTransform: 'capitalize' }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.body}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}

        {/* Pagination Controls */}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            onClick={handlePrevPage}
            disabled={page <= 1 || loading}
            startIcon={<NavigateBeforeIcon />}
          >
            Previous
          </Button>
          <Typography>Page {page}</Typography>
          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={!hasMore || loading}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaginatedSearch;

