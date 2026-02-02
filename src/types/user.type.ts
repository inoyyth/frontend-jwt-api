import type { Pagination } from "../components/shared/pagination";

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