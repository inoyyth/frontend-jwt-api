import { useMutation } from "@tanstack/react-query";
import { Api } from "../../service/api";
import { api_endpoint } from "../../config/config";

interface LoginRequest {
    email: string;
    password: string;
}

export const useLogin = () => {
    return useMutation({
        // Mutation for logging in a user
        mutationFn: async (data: LoginRequest) => {
            // TODO: Implement login logic
            const response = await Api.post(api_endpoint.auth.login, data);
            // TODO: Handle response
            return response.data;
        },
    });
}
