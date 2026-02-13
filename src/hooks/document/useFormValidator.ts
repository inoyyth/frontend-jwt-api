import { z } from "zod"

export class DocumentFormValidator {
    private static readonly baseSchema = z.object({
        name: z.string().min(1, "Name is required"),
        // validation single file only and required
        file: z.any().refine((file) => {
            return file.length > 0;
        }, {
            message: "File is required",
        }).refine((file) => {
            // Check if file exists and size is less than 10MB (10 * 1024 * 1024 bytes)
            return file.length > 0 && file[0]?.size <= 10 * 1024 * 1024;
        }, {
            message: "File size must be less than 10MB",
        }).refine((file) => {
            // Check if file is PDF or image (jpg, jpeg, png, gif, bmp, webp)
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/jpg', 
                'image/png',
                'image/gif',
                'image/bmp',
                'image/webp'
            ];
            return file.length > 0 && allowedTypes.includes(file[0]?.type);
        }, {
            message: "Only PDF and image files are allowed",
        }),

    });

    static getSchema() {
        return this.baseSchema;
    }
}

export type BaseFormData = z.infer<typeof DocumentFormValidator['baseSchema']>;
export type FormData = BaseFormData;
