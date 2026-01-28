import { useMutation } from "@tanstack/react-query";
import Api from "../../service/api";


interface LoginRequest {
    email: string;
    password: string;
}

export const useLogin = () => {
    return useMutation({
        // Mutation for logging in a user
        mutationFn: async (data: LoginRequest) => {
            // TODO: Implement login logic
            const response = await Api.post('/login', data);
            // TODO: Handle response
            return response.data;
        },
    });
}
