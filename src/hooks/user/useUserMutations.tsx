import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../service/api";
import { type UserRequest, type UserResponse } from "./useUser";

export type { UserRequest, User } from "./useUser";

export const useUserMutations = () => {
    const storeUser = useMutation({
        mutationKey: ['store_users'],
        mutationFn: async (user: UserRequest) => {
            const token = Cookies.get('token');
            const response = await Api.post('/user', user, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data.data as UserResponse;
        },
    });

     const updateUser = useMutation({
        mutationKey: ['update_users'],
        mutationFn: async (user: UserRequest) => {
            const token = Cookies.get('token');
            const response = await Api.put(`/user/${user?.id}`, user, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data.data as UserResponse;
        },
    });

    const removeUser = useMutation({
        mutationKey: ['delete_users'],
        mutationFn: async (id: number) => {
            const token = Cookies.get('token');
            const response = await Api.delete(`/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data.data as UserResponse;
        }
    })
    
    return {
        storeUser,
        updateUser,
        removeUser
    };
};
