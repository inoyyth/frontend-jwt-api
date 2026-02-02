import { useMutation } from "@tanstack/react-query"
import { Api } from "../../service/api";

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export const useRegister = () => {
    return useMutation({
        // Mutation for registering a new user
        mutationFn: async (data: RegisterRequest) => {
            // TODO: Implement registration logic
            const response = await Api.post('/api/register', data);
            // TODO: Handle response
            return response.data;
        },
    });
}