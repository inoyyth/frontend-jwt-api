export const convertBase64ToImage = (base64: string) => {
    const image = new Image();
    image.src = base64;
    return image;
}

export const convertImageToBase64 = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    
    ctx.drawImage(img, 0, 0);
    
    // Detect image type from src
    const getMimeType = (src: string): string => {
        if (src.startsWith('data:image/')) {
            return src.split(',')[0].split(':')[1].split(';')[0];
        }
        if (src.includes('.png')) return 'image/png';
        if (src.includes('.jpg') || src.includes('.jpeg')) return 'image/jpeg';
        if (src.includes('.gif')) return 'image/gif';
        if (src.includes('.webp')) return 'image/webp';
        return 'image/jpeg'; // fallback
    };
    
    const mimeType = getMimeType(img.src);
    const quality = mimeType === 'image/png' ? undefined : 0.8;
    return canvas.toDataURL(mimeType, quality);
}
