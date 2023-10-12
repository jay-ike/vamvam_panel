import axios from 'axios';
import { getBearerAccessToken } from '../auth/auth';

const BEARER_TOKEN: string | undefined = getBearerAccessToken();
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("BASE_URL", BASE_URL);


let headers: any = {}

if (BEARER_TOKEN) {
    headers['Authorization'] = "Bearer " + BEARER_TOKEN;
}

const axiosInstance = axios.create({
    url: BASE_URL,
    method: 'GET',
    headers: headers,
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        if (config.baseURL == BASE_URL && BEARER_TOKEN != undefined) {
            config.headers['Authorization'] = "Bearer " + BEARER_TOKEN;
        }
        return config;
    }
)


axiosInstance.interceptors.response.use(

    //successful callback, we don't need to do anything
    (response) => {
        return response
    },

    //check if we received a 404 and redirect
    (error) => {
        if (error.response.status === 404) {
            // router.push({name: 'notfound' })
            return Promise.reject(error)
        }
        else if (error.response.status === 401) {
            return Promise.reject(error)
        }
        else {
            return Promise.reject(error)
        }
    }
)

export {
    axiosInstance as apiService
};