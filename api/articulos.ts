import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3100',
});

export default instance;
