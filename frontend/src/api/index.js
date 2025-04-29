import axios from "axios"

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_V1_STRING}`,
    withCredentials: true,
    timeout: 5_000,
})

export const getErrorReponse = (error) => {
    if (axios.isAxiosError(error)) {
        return {
          error: error,
          message: error.response?.data?.message || error.message
        };
      } else {
        return {
          error: error,
          message: "UnexpectedError"
        };
      }
}