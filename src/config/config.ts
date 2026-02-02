export const base_url = import.meta.env.VITE_API_BASE_URL

export const api_endpoint = {
    'auth': {
        'login': '/login',
        'register': '/register',
    },
    'user': {
        'get': '/user',
        'store': '/user',
        'update': '/user',
        'fetch': '/user',
        'delete': '/user',
        'export_csv': '/user/export-csv',
        'export_excel': '/user/export-excel',
    },
    'document': {
        'upload_chunk': '/document/upload-chunk',
        'complete_upload': '/document/complete-upload',
    }
}