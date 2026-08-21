import axios from "axios";
import { BACKEND_API_URL } from "../shared/constants/env";

const api = axios.create({

    // BACKEND_API_URL reads REACT_APP_BACKEND_API_URL at build time, falling
    // back to localhost only for local dev — a hardcoded URL here would break
    // every non-local deployment (staging, prod, Docker) since it can't be
    // overridden per environment.
    baseURL: BACKEND_API_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers["Content-Type"] =
                "multipart/form-data";
        }

        return config;
    },

    (error) => Promise.reject(error)
);

export default api;