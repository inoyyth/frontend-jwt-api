import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../service/api";
import type { Pagination } from "../../components/shared/pagination";

export interface UserRequest {
    id?: number;
    name: string;
    email: string;
    password?: string;
    image?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    image?: string;
    created_at: string;
    updated_at: string;
}

export interface UserQueryParams {
    keyword: string;
    page: number;
    limit: number;
}

export interface UserResponse {
    data: User[];
    pagination: Pagination;
}

export const useUser = (params?: UserQueryParams) => {
    const getUser = useQuery({
        queryKey: ['get_users', params],
        queryFn: async () => {
            const token = Cookies.get('token');
            const response = await Api.get(`/user`, {
                params: params || { keyword: '', page: 1, limit: 10 },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data.data as UserResponse;
        },
    });

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
        getUser,
        storeUser,
        updateUser,
        removeUser
    };
};