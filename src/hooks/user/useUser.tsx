    import { useMutation, useQuery } from "@tanstack/react-query";
    import { ApiWithAuth } from "../../service/api";
import type { UserQueryParams, UserResponse, UserRequest } from "../../types/user.type";

    export const useUser = (params?: UserQueryParams) => {
        const getUser = useQuery({
            queryKey: ['get_users', params],
            queryFn: async () => {
                const response = await ApiWithAuth.get(`/user`, {
                    params: params || { keyword: '', page: 1, limit: 10 },
                });
                
                return response.data.data as UserResponse;
            },
        });

        const storeUser = useMutation({
            mutationKey: ['store_users'],
            mutationFn: async (user: UserRequest) => {
                const response = await ApiWithAuth.post('/user', user);
                
                return response.data.data as UserResponse;
            },
        });

        const updateUser = useMutation({
            mutationKey: ['update_users'],
            mutationFn: async (user: UserRequest) => {
                const response = await ApiWithAuth.put(`/user/${user?.id}`, user);
                
                return response.data.data as UserResponse;
            },
        });

        const removeUser = useMutation({
            mutationKey: ['delete_users'],
            mutationFn: async (id: number) => {
                const response = await ApiWithAuth.delete(`/user/${id}`);
                
                return response.data.data as UserResponse;
            }
        })

        const downloadCsv = useQuery({
            queryKey: ['download_excel', params],
            queryFn: async () => {
                const response = await ApiWithAuth.get(`/user/export-csv`, {
                    params: params || { keyword: '', page: 1, limit: 10 },
                    headers: {
                        'Content-Type': 'text/csv'
                    },
                    responseType: 'blob'
                });
                
                return response;
            },
            enabled: false, // Prevent automatic execution on component mount
        });

        const downloadExcel = useQuery({
            queryKey: ['download_excel', params],
            queryFn: async () => {
                const response = await ApiWithAuth.get(`/user/export-excel`, {
                    params: params || { keyword: '', page: 1, limit: 10 },
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    },
                    responseType: 'blob'
                });
                
                return response;
            },
            enabled: false, // Prevent automatic execution on component mount
        });

        return {
            getUser,
            storeUser,
            updateUser,
            removeUser,
            downloadCsv,
            downloadExcel
        };
    };