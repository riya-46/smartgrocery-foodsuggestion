import axios from "axios";

const api = axios.create({
  baseURL: "https://smartgrocery-backend.onrender.com",
});

export default api;
