export class ImageService {
    private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    static convertBase64ToImage(base64: string): HTMLImageElement {
        const image = new Image();
        image.src = base64;
        return image;
    }

    static convertImageToBase64(img: HTMLImageElement): string {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const mimeType = this.getMimeType(img.src);
        const quality = mimeType === 'image/png' ? undefined : 0.8;
        return canvas.toDataURL(mimeType, quality);
    }

    static validateImageFile(file: File): { isValid: boolean; error?: string } {
        if (!this.ALLOWED_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: "Only image files (JPEG, PNG, GIF, WebP) are allowed"
            };
        }
        return { isValid: true };
    }

    private static getMimeType(src: string): string {
        if (src.startsWith('data:image/')) {
            return src.split(',')[0].split(':')[1].split(';')[0];
        }
        if (src.includes('.png')) return 'image/png';
        if (src.includes('.jpg') || src.includes('.jpeg')) return 'image/jpeg';
        if (src.includes('.gif')) return 'image/gif';
        if (src.includes('.webp')) return 'image/webp';
        return 'image/jpeg'; // fallback
    }

    static readFileAsBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
