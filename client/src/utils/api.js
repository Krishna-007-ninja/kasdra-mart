import axios from 'axios';

const getBaseURL = () => {
  let url =
    import.meta.env.VITE_API_BASE_URL || 'https://kasdra-mart.onrender.com/api';
  // If the user forgot to add /api at the end, add it automatically
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api` : `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;