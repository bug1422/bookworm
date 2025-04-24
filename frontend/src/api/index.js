import axios from "axios"

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_V1_STRING}`,
    withCredentials: true,
    timeout: 5_000,
})

const MAX_RETRIES = 3
api.interceptors.response.use(
    res => res,
    async err => {
        const { config, code } = err;
        config.__retryCount = config.__retryCount ?? 0;

        const shouldRetry =
        code === 'ERR_NETWORK' &&
        config.__retryCount < MAX_RETRIES;

        if(!shouldRetry) throw err;
        config.__retryCount += 1;
        const delay = 200 * Math.pow(2, config.__retryCount - 1)
        await new Promise(r => setTimeout(r, delay))

        return api(config)
    }
)
