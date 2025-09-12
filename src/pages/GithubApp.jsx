import { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Link,
  Stack,
  IconButton,
} from "@mui/material";
import { GitHub, OpenInNew, Star, ForkRight } from "@mui/icons-material";

const GithubApp = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setUserData(null);
    setRepos([]);

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      setLoading(false);
      return;
    }

    try {
      const userResponse = await axios.get(
        `https://api.github.com/users/${username}`
      );
      setUserData(userResponse.data);

      const reposResponse = await axios.get(
        `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`
      );
      setRepos(reposResponse.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`User "${username}" not found.`);
      } else {
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          GitHub Profile Finder
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Enter GitHub Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading}
            endIcon={<GitHub />}
          >
            Search
          </Button>
        </Stack>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {userData && (
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                src={userData.avatar_url}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                {userData.name || userData.login}
              </Typography>
              {userData.bio && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {userData.bio}
                </Typography>
              )}
            </Box>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">
                Followers: <b>{userData.followers}</b>
              </Typography>
              <Typography variant="body2">
                Following: <b>{userData.following}</b>
              </Typography>
            </Stack>

            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Button
                href={userData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<OpenInNew />}
              >
                View Profile
              </Button>
            </Box>

            <Typography variant="h6" component="h3" gutterBottom>
              Repositories ({repos.length})
            </Typography>
            {repos.length > 0 ? (
              <List sx={{ maxHeight: 240, overflow: "auto" }}>
                {repos.map((repo) => (
                  <ListItem
                    key={repo.id}
                    disablePadding
                    sx={{
                      mb: 1,
                      p: 1.5,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <ListItemText
                      primary={repo.name}
                      secondary={repo.description}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ ml: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Star sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {repo.stargazers_count}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ForkRight
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {repo.forks_count}
                        </Typography>
                      </Stack>
                      <IconButton
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        <OpenInNew sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No public repositories found.
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GithubApp;
