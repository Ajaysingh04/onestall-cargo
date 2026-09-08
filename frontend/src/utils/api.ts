import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://onestall-cargo.onrender.com/api', // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
