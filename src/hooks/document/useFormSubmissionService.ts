
import type { DocumentRequest } from "../../types/document.type";
import type { FormData } from "../document/useFormValidator";

export class DocumentFormSubmissionService {
    static prepareSubmitData(formData: FormData): DocumentRequest {
        return {
            name: formData.name,
            file: formData.file,
        };
    }

    static validateSubmitData(data: DocumentRequest): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!data.name?.trim()) {
            errors.push("Name is required");
        }
        
        if (!data.file) {
            errors.push("File is required");
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
