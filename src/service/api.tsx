import axios from "axios";

export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const Api = axios.create({
  baseURL: "http://localhost:3000",
});

export default Api;

