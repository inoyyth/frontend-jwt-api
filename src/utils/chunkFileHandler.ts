import { api_endpoint } from "../config/config";
import { ApiWithAuth } from "../service/api";

export const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB

type ChunkType = {
    file_id: string;
    name: string;
    extention: string;
}

export const chunkFile = (file: File) => {
    const chunks: Blob[] = [];
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        chunks.push(file.slice(start, end));
    }
    
    return chunks;
}


export const uploadFileInChunks = async (file: File, name: string, setProgress: (progress: number) => void) => {
    const chunks = chunkFile(file);
    // TODO: implement upload logic
    const fileID = crypto.randomUUID();
    const fileExtention = file.name.split('.').pop();
    
    for (let i = 0; i < chunks.length; i++) {
        const formData = new FormData();
        formData.append('file_id', fileID);
        formData.append('chunk_index', i.toString());
        formData.append('total_chunks', chunks.length.toString());
        formData.append('data', chunks[i]);
        formData.append('name', name + '.' + fileExtention);

        await ApiWithAuth.post(api_endpoint.document.upload_chunk, formData);

        setProgress(((i + 1) / chunks.length) * 100);
    }

    await ApiWithAuth.post(api_endpoint.document.complete_upload, { file_id: fileID, name: name, extention: fileExtention } as ChunkType);
}
