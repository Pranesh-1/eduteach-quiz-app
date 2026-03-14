import axios from 'axios';

const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  // Remove any trailing slashes for consistency
  url = url.replace(/\/+$/, '');

  // If the URL doesn't end with /api and it's not a localhost address
  if (url && !url.endsWith('/api') && !url.includes('localhost')) {
    url = url + '/api';
  }
  
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Could not connect to the server. Please check your connection.';
    } else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    return Promise.reject(error);
  }
);

export const requestAuth = async (url, data) => {
    const res = await api.post(url, data);
    return res.data;
};

export default api;
