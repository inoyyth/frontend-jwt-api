import { ApiWithAuth } from "../service/api";

export const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB

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


export const uploadFileInChunks = async (file: File, name: string) => {
    const chunks = chunkFile(file);
    // TODO: implement upload logic
    const fileID = crypto.randomUUID();

    console.log("chunks", chunks)
    
    for (let i = 0; i < chunks.length; i++) {
        const formData = new FormData();
        formData.append('file', fileID);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', chunks.length.toString());
        formData.append('chunk', chunks[i]);
        formData.append('name', name);

        await ApiWithAuth.post('/upload/chunk', formData);

        console.log('Uploaded chunk', i + 1, 'of', chunks.length);
    }

    await ApiWithAuth.post('/upload/complete', { file: fileID, name });
}
