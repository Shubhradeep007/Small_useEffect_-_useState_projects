import { useState, useEffect } from "react";
import axios from "axios";

const EmailSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setError(null);
      return;
    }

    const timerId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/comments?email_like=${query}`
        );

        if (response.data.length === 0) {
          setError("No results found for this email.");
        } else {
          setResults(response.data);
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Search Comments by Email</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., Jayne_Kuhic@sydney.com"
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
          fontSize: "16px",
        }}
      />

      <div style={{ marginTop: "20px" }}>
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

        {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {results.map((comment) => (
            <li
              key={comment.id}
              style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
            >
              <strong style={{ color: "#007BFF" }}>{comment.email}</strong>
              <p style={{ margin: "5px 0 0 0" }}>{comment.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailSearch;
