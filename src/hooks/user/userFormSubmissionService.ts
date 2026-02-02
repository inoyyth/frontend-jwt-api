
import type { UserRequest } from "../../types/user.type";
import type { FormData } from "./userFormValidator"

export class UserFormSubmissionService {
    static prepareSubmitData(formData: FormData, existingUser: boolean, imageData?: string): UserRequest {
        return {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            password: formData.password || (existingUser ? '' : 'default'),
            image: imageData,
        };
    }

    static validateSubmitData(data: UserRequest): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!data.name?.trim()) {
            errors.push("Name is required");
        }
        
        if (!data.email?.trim()) {
            errors.push("Email is required");
        }
        
        if (data.email === "supriyadin@99.co") {
            errors.push("Email is not allowed");
        }
        
        if (!data.id && !data.password) {
            errors.push("Password is required for new users");
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
