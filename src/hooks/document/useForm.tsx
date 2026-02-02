import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DocumentFormValidator } from "./useFormValidator";
import type { FormData } from "./useFormValidator";

export const useDocumentForm = () => {
    // TODO: Implement document form hook
     const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
            resolver: zodResolver(DocumentFormValidator.getSchema()),
        });

    return {
        // Form state and handlers will be implemented here
        register,
        handleSubmit,
        errors,
        setValue
    };
};