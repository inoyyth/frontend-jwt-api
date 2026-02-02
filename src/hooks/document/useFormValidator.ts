import { z } from "zod"

export class DocumentFormValidator {
    private static readonly baseSchema = z.object({
        name: z.string().min(1, "Name is required"),
        // validation single file only and required
        file: z.any().refine((file) => {
            return file.length > 0;
        }, {
            message: "File is required",
        }),

    });

    static getSchema() {
        return this.baseSchema;
    }
}

export type BaseFormData = z.infer<typeof DocumentFormValidator['baseSchema']>;
export type FormData = BaseFormData;
