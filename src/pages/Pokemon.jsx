import {
  Button,
  Container,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import axios from "axios";
import { useEffect, useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import IconButton from "@mui/joy/IconButton";
import BookmarkAdd from "@mui/icons-material/BookmarkAddOutlined";

const Pokemon = () => {
  const [data, setData] = useState({});
  const [pokemonselector, setPokemonSelector] = useState("");
  const [errors, setErrors] = useState(null);
  const [loader, setLoader] = useState(false);

  const fetchData = () => {
    setLoader(true);
    setErrors(null);
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonselector}`
        );
        console.log(response?.data);
        setData(response?.data);
      } catch (error) {
        setErrors("The Name is invalid!");
        console.log(error);
      } finally {
        setLoader(false);
      }
    }, 500);
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if(!pokemonselector){
        setErrors("Please enter a name")
        return
    }
    fetchData();
  };
  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <form onSubmit={handelSubmit}>
          <Paper elevation={3} sx={{ p: 3, display: "flex" }}>
            <TextField
              fullWidth
              id="demo-simple-select"
              value={pokemonselector}
              label="Pokemon Name"
              placeholder="Search the name of pokemon..."
              onChange={(e) => setPokemonSelector(e.target.value)}
            />

            <Button type="submit" variant="outlined" sx={{ ml: 2 }}>
              search
            </Button>
          </Paper>
        </form>
      </Container>
      
      <Container maxWidth="sm">
        {errors && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
        <Typography color="error">
            {errors}
        </Typography>
        </Box>
      )}
        {loader ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <CircularProgress />
            </Box>
          </>
        ) : (
          <>
            {data?.abilities?.length > 0 && (
              <Paper sx={{ marginTop: 4, p: 2 }}>
                <Typography variant="h6">Abilities for {data.name}</Typography>
                <List>
                  {data.abilities.map((e) => (
                    <ListItem key={e.ability.name}>{e.ability.name}</ListItem>
                  ))}
                </List>

                <Typography variant="h6">Types for {data.name}</Typography>
                <List>
                  {data.types.map((e) => (
                    <ListItem key={e.type.name}>{e.type.name}</ListItem>
                  ))}
                </List>

                <Typography variant="h6">Stats for {data.name}</Typography>
                <List>
                  {data.stats.map((e) => (
                    <ListItem key={e.stat.name}>{e.stat.name}</ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Pokemon;
