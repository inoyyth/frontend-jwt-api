import axios from "axios";
import { base_url } from "../config/config";

export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}
console.log("API BASE URL", base_url)
const Api = axios.create({
  baseURL: base_url,
});

export default Api;

