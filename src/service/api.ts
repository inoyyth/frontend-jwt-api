import axios from "axios";
import { base_url } from "../config/config";
import Cookies from "js-cookie";

export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const Api = axios.create({
  baseURL: base_url,
});

// redirect to login if the token is expired
const ApiWithAuth = axios.create({
  baseURL: base_url,
  headers: {
    'Authorization': `Bearer ${Cookies.get('token')}`,
  },
});

export {
    Api,
    ApiWithAuth
}

