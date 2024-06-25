import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4444',
});

// при любом запросе проверка на наличие токена в localStorage
instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('token');

  return config;
});

export default instance;
