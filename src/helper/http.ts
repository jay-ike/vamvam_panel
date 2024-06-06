import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getAuthToken } from "./utils";

const BASE_URL = import.meta.env.VITE_API_URL;

const queryClient = new QueryClient();
const axiosInstance = axios.create({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(function (config) {
  const BEARER_TOKEN = getAuthToken();
  if (config.baseURL == BASE_URL && BEARER_TOKEN) {
    config.headers["Authorization"] = "Bearer " + BEARER_TOKEN;
  }
  return config;
});
function mockApiCall(shouldSucceed = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({});
      } else {
        reject(new Error("API call failed"));
      }
    }, 4000);
  });
}

export { axiosInstance as axios, queryClient, mockApiCall };
