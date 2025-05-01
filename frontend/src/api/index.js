import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/${
    import.meta.env.VITE_API_V1_STRING
  }`,
  withCredentials: true,
  timeout: 5_000,
});

export const getDataResponse = (response) => {
  return {
    data: response.data?.detail,
  };
};

export const getErrorReponse = (error) => {
  if (axios.isAxiosError(error)) {
    return {
      error: error,
      message: error.response?.data?.detail || error.message,
    };
  } else {
    return {
      error: error,
      message: "UnexpectedError",
    };
  }
};

let isRefreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (originalReq.skipRefresh) {
      return Promise.reject(err);
    }
    if (err.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) return Promise.reject(err);
      originalReq._retry = true;
      isRefreshing = true;
      try {
        await api.get("/users/refresh-token");
        isRefreshing = false;
        return api(originalReq);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);
