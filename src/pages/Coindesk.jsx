import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format large numbers
const formatMarketCap = (num) => {
  if (num > 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num > 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  return `${(num / 1_000).toFixed(2)}K`;
};


const CryptoTracker = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);

  // Effect to fetch the list of top 100 cryptocurrencies
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets', {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Effect to fetch price history when a coin is selected
  useEffect(() => {
    if (!selectedCoin) return;

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: '30', // Fetch data for the last 30 days
            },
          }
        );
        
        // Format data for the chart
        const prices = response.data.prices;
        setChartData({
          labels: prices.map(price => new Date(price[0]).toLocaleDateString()),
          datasets: [{
            label: `${selectedCoin.name} Price (USD)`,
            data: prices.map(price => price[1]),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }],
        });
      } catch (err) {
        console.error('Failed to fetch chart data', err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [selectedCoin]);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        Crypto Tracker 🪙
      </Typography>

      {/* Chart Section */}
      {selectedCoin && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Price History for {selectedCoin.name} (Last 30 Days)
          </Typography>
          {loadingChart ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            chartData && <Line data={chartData} />
          )}
        </Paper>
      )}

      {/* Coins Table Section */}
      <TableContainer component={Paper}>
        <Table aria-label="crypto table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Coin</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>24h % Change</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Market Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coins.map((coin) => (
              <TableRow
                key={coin.id}
                hover
                onClick={() => setSelectedCoin(coin)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{coin.market_cap_rank}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <Typography variant="body2" component="span" fontWeight="bold">{coin.name}</Typography>
                    <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                      {coin.symbol.toUpperCase()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: coin.price_change_percentage_24h > 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell align="right">
                  ${formatMarketCap(coin.market_cap)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CryptoTracker;