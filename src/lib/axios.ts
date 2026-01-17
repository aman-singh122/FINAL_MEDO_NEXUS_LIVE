import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // ✅ safety
});

/* ---------- REQUEST INTERCEPTOR ---------- */
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    config.headers = {
      ...config.headers,
    };

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


/* ---------- RESPONSE INTERCEPTOR ---------- */
API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    console.error(
      "API Error:",
      error.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);

export default API;
