class BlobHandler {
    private static mimeToExtension: { [key: string]: string } = {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-excel': 'xls',
        'text/csv': 'csv',
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'text/plain': 'txt',
        'application/json': 'json',
        'application/xml': 'xml',
        'application/zip': 'zip'
    };

    static downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static getFileExtensionFromBlob(blob: Blob): string {
        const mimeType = blob.type;
        return this.mimeToExtension[mimeType] || 'bin';
    }

    static downloadBlobWithAutoExtension(blob: Blob, baseFilename: string): void {
        const extension = this.getFileExtensionFromBlob(blob);
        const filename = baseFilename.includes('.') ? baseFilename : `${baseFilename}.${extension}`;
        this.downloadBlob(blob, filename);
    }
}

export default BlobHandler;