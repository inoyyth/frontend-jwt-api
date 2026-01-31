import { z } from "zod"

export class UserFormValidator {
    private static readonly baseSchema = z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email"),
        // validate image size max 2mb & allow empty
        image: z.optional(z.instanceof(FileList)).refine((file) => {
            if (!file || !file[0]) return true; // No file is valid
            return file[0].size < 2 * 1024 * 1024; // File must be less than 2MB
        }, {
            message: "Image size must be less than 2MB",
        }),
    }).refine((data) => data.email !== "supriyadin@99.co", {
        message: "Email is not allowed",
        path: ["email"],
    });

    private static readonly passwordSchema = z.object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    static getSchema(enableChangePassword: boolean) {
        return enableChangePassword 
            ? this.baseSchema.merge(this.passwordSchema) 
            : this.baseSchema;
    }
}

export type BaseFormData = z.infer<typeof UserFormValidator['baseSchema']>;
export type PasswordFormData = z.infer<typeof UserFormValidator['passwordSchema']>;
export type FormData = BaseFormData & Partial<PasswordFormData>;
