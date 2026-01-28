import { useEffect, type FunctionComponent, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserMutations, type UserRequest, type User } from "../../../hooks/useUserMutations"
import { useModal } from "../../../hooks/modal/useModal"
import { useToast } from "../../../hooks/toast/useToast"
import type { ApiError } from "../../../service/api"

interface UserForm {
    fetchUser: () => void;
    data?: User | null;
}

const FormUser: FunctionComponent<UserForm> = ({fetchUser, data}) => {
    const { hideModal } = useModal();
    const {addToast} = useToast();
    const { storeUser, updateUser } = useUserMutations();
    const { mutate: storeUserMutation, isPending: isStoreUserPending, error: storeUserError } = storeUser;
    const { mutate: updateuserMutation, isPending: isUpdateUserPending, error: updateUserError } = updateUser;
    const [enableChangePassword, setEnableChangePassword] = useState(true);

    const baseSchema = z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email"),
    }).refine((data) => data.email !== "supriyadin@99.co", {
        message: "Email is not allowed",
        path: ["email"],
    });

    const passwordSchema = z.object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    const schema = enableChangePassword ? baseSchema.merge(passwordSchema) : baseSchema;
    
    type BaseFormData = z.infer<typeof baseSchema>;
    type PasswordFormData = z.infer<typeof passwordSchema>;
    type FormData = BaseFormData & Partial<PasswordFormData>;

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const setDefaultData = () => {
        if (data) {
            setEnableChangePassword(false);
            setValue("id", data.id);
            setValue("name", data.name);
            setValue("email", data.email);
        }
    }

    const onSubmit = (formData: FormData) => {
        // For new users (no data), password is always required
        // For existing users, only include password if enableChangePassword is true
        const submitData: UserRequest = {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            password: formData.password || (data ? '' : 'default'), // Handle new user case
        };
        if (data) {
            updateuserMutation(submitData, {
                onSuccess: () => {
                    hideModal("user-form-modal");
                    fetchUser();
                    addToast("user-form-toast", "User updated success", "success", {title: "Success"});
                },
            });
        } else {
        storeUserMutation(submitData, {
            onSuccess: () => {
                hideModal("user-form-modal");
                fetchUser();
                addToast("user-form-toast", "User created successfully", "success", {title: "Success"});
            },
            
        });
    }
    }

    if (storeUserError) {
        hideModal("user-form-modal");
        const errorMessage = (storeUserError as ApiError)?.response?.data?.message || (storeUserError as Error).message || "Failed to create user";
        addToast("user-form-toast", errorMessage, "danger", {title: "Error"});
    }

    if (updateUserError) {
        hideModal("user-form-modal");
        const errorMessage = (updateUserError as ApiError)?.response?.data?.message || (updateUserError as Error).message || "Failed to update user";
        addToast("user-form-toast", errorMessage, "danger", {title: "Error"});
    }

    useEffect(() => {
        setDefaultData();
    }, []);

    return (
        <>
            <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-bold d-flex justify-content-start">Name</label>
                    <input type="text" className="form-control" {...register("name")} id="name" placeholder="Ex.Arfan" />
                    {errors.name && <p className="text-danger d-flex justify-content-start">{errors.name.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold d-flex justify-content-start">Email</label>
                    <input type="email" className="form-control" {...register("email")} id="email" placeholder="Ex.arfan@example.com" />
                    {errors.email && <p className="text-danger d-flex justify-content-start">{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold d-flex justify-content-start">Password</label>
                    <input type="password" className="form-control" {...register("password")} id="password" placeholder="Ex.arfan@example.com" disabled={!enableChangePassword} />
                    {errors.password?.message && <p className="text-danger d-flex justify-content-start">{errors.password.message}</p>}
                </div>
                <div className="mb-0">
                    <label htmlFor="confirmPassword" className="form-label fw-bold d-flex justify-content-start">Confirm Password</label>
                    <input type="password" className="form-control" {...register("confirmPassword")} id="confirmPassword" placeholder="Ex.arfan@example.com" disabled={!enableChangePassword}/>
                    {errors.confirmPassword?.message && <p className="text-danger d-flex justify-content-start">{errors.confirmPassword.message}</p>}
                </div>
                {data !== null && (
                <div className="mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={(e) => setEnableChangePassword(e.target.checked)} />
                        <label className="form-check-label d-flex justify-content-start" htmlFor="flexCheckDefault">
                            Update Password
                        </label>
                    </div>
                </div>
                )}
                <div className="mb-3 w-100 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" disabled={isStoreUserPending || isUpdateUserPending}>
                        {isStoreUserPending || isUpdateUserPending ? "Loading..." : "Simpan"}
                    </button>
                </div>
            </form>
        </>
    )
}

export default FormUser
