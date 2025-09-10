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
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const UserSearch = () => {
  // State for the search input
  const [query, setQuery] = useState("");
  // State to hold the raw results from the API
  const [users, setUsers] = useState([]);
  // State to hold the sorted results for display
  const [sortedResults, setSortedResults] = useState([]);
  // State for the current sorting option
  const [sortBy, setSortBy] = useState("name"); // Default sort by name
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This effect triggers a debounced search when the user types.
  useEffect(() => {
    const timerId = setTimeout(async () => {
      if (query.trim() === "") {
        setUsers([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users?name_like=${query}`
        );
        console.log(response.data)
        setUsers(response.data);
      } catch (err) {
        setError("An error occurred while fetching users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timerId);
  }, [query]);

  // This effect runs whenever the raw user data or the sort option changes.
  useEffect(() => {
    let sorted = [...users]; // Create a copy of the users array
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "id") {
      sorted.sort((a, b) => a.id - b.id);
    }
    setSortedResults(sorted);
  }, [users, sortBy]); // Re-sort when users or sortBy changes

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sortable User Search
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search for users by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="id">ID</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {!loading && !error && users.length === 0 && query && (
          <Typography color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
            No users found for "{query}".
          </Typography>
        )}

        {sortedResults.length > 0 && !loading && (
          <List>
            <Divider />
            {sortedResults.map((user) => (
              <ListItem key={user.id} divider>
                <Box>
                  <Typography variant="h6" component="h3">
                    {user.name} (ID: {user.id})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email} | {user.phone}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default UserSearch;

