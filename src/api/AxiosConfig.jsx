import axios from "axios";

let api;

try {
  api = axios.create({
    baseURL: "http://localhost:9090",
  });
} catch {

  api = axios;
}
if (api?.interceptors?.request?.use) {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

export default api;
