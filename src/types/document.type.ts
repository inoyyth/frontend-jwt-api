import type { Pagination } from "../components/shared/pagination";

export interface DocumentRequest {
    name: string;
    file: File;
}

export interface Document {
    id: number;
    name: string;
    file: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentQueryParams {
    keyword: string;
    page: number;
    limit: number;
}

export interface DocumentResponse {
    data: Document[];
    pagination: Pagination;
}