import { Link } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

const Newsapi = () => {
  const apikey = "eb12e151599445b1a9e1ccd7287b80a2";
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { Label: "Business", value: "Business" },
    { Label: "Entertainment", value: "Entertainment" },
    { Label: "General", value: "General" },
    { Label: "Health", value: "Health" },
  ];
  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    if (!category) return;
    try {
      setLoading(true);
      const response = await axios.get(
        ` https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apikey}`
      );
      console.log(response?.data?.articles);
      setData(response?.data?.articles);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.Label}
          </option>
        ))}
      </select> */}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.Label}
          </option>
        ))}
      </select>

      {/* {data.length === 0 && (
        <div className="alert alert-danger" style={{ whiteSpace: "pre-line" }}>
          No News Found
        </div>
      )} */}

      {loading ? (
        <p>loading.........</p>
      ) : (
        data.map((value, idx) => (
          <div
            key={idx}
            className="container"
            style={{
              border: "2px solid black",
              padding: "10px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <a href={value.url}>
              <h5>{value.title}</h5>
            </a>
            <p>Author: {value.author}</p>
            <p>Desc: {value.description}</p>
            <p>
              Published At:
              {new Date(value.publishedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            {/* <Link to={value.url}>{value.url}</Link> */}
            <a href={value.url} target="_blank" style={{cursor: "pointer"}}>  {value.url} </a>
          </div>
        ))
      )}
    </div>
  );
};

export default Newsapi;
