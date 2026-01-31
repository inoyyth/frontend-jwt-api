import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useRef, useState } from "react"
import { UserFormValidator, type FormData } from "./userFormValidator"
import { ImageService } from "../../services/imageService"
import { useToast } from "../toast/useToast"
import type { User } from "./useUserMutations"


interface UseUserFormProps {
    data?: User | null;
}

export const useUserForm = ({ data }: UseUserFormProps) => {
    const { addToast } = useToast()
    const [enableChangePassword, setEnableChangePassword] = useState(true);
    const imageRef = useRef<HTMLImageElement>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(UserFormValidator.getSchema(enableChangePassword)),
    });

    const setDefaultData = useCallback(() => {
        if (data) {
            setEnableChangePassword(false);
            setValue("id", data.id);
            setValue("name", data.name);
            setValue("email", data.email);
            if (data.image && imageRef.current) {
                imageRef.current.src = data.image;
            }
        }
    }, [data, setValue]);

    const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validation = ImageService.validateImageFile(file);
            if (!validation.isValid) {
                // Toast will be handled by component
                e.target.value = '';
                return validation.error;
            }
            
            try {
                const base64 = await ImageService.readFileAsBase64(file);
                if (imageRef.current) {
                    imageRef.current.src = base64;
                }
                return null;
            } catch {
                return "Failed to read image file";
            }
        }
        return null;
    }, []);

    const getImageData = useCallback((): string | undefined => {
        if (imageRef.current && imageRef.current.src !== "/man-icon.png" && !imageRef.current.src.includes("http")) {
            return ImageService.convertImageToBase64(imageRef.current);
        }
        return undefined;
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const error = await handleImageChange(e);
        if (error) {
            addToast("user-form-toast", error, "danger", {title: "Invalid File Type"});
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        setValue,
        enableChangePassword,
        setEnableChangePassword,
        imageRef,
        setDefaultData,
        handleImageChange,
        handleImageUpload,
        getImageData
    };
};


