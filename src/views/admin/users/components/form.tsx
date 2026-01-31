import { useEffect, type FunctionComponent } from "react"
import { useUserMutations, type User } from "../../../../hooks/user/useUserMutations"
import { useModal } from "../../../../hooks/modal/useModal"
import { useToast } from "../../../../hooks/toast/useToast"
import { useUserForm } from "../../../../hooks/user/useUserForm"
import { UserFormSubmissionService } from "../../../../hooks/user/userFormSubmissionService"
import type { FormData } from "../../../../hooks/user/userFormValidator"
import type { ApiError } from "../../../../service/api"

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
    
    const {
        register,
        handleSubmit,
        errors,
        enableChangePassword,
        setEnableChangePassword,
        imageRef,
        setDefaultData,
        handleImageUpload,
        getImageData,
    } = useUserForm({ data });


    const onSubmit = (formData: FormData) => {
        const imageData = getImageData();
        console.log("imageData", imageData)
        const submitData = UserFormSubmissionService.prepareSubmitData(
            formData,
            !!data,
            imageData
        );
        
        const validation = UserFormSubmissionService.validateSubmitData(submitData);
        console.log("validation", validation)
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                addToast("user-form-toast", error, "danger", {title: "Validation Error"});
            });
            return;
        }
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
    }, [setDefaultData]);

    return (
        <>
            <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex gap-4">
                     <div className="d-flex flex-column gap-4">
                        <div>
                            <label htmlFor="image" className="form-label fw-bold d-flex justify-content-start">Image</label>
                            {/* set default image when empty */}
                            <img 
                                ref={imageRef}
                                src={data?.image || "/man-icon.png"} 
                                alt="User profile" 
                                style={{width: 150, height: 150, objectFit: 'cover'}}
                            />
                        </div>
                        <div>
                            <input type="file" className="form-control" {...register("image")} id="image" placeholder="Ex.Arfan" onChange={handleImageUpload} accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" />
                            {errors.image && <p className="text-danger d-flex justify-content-start">{errors.image.message}</p>}
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-fill">
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
                    </div>
                </div>
            </form>
        </>
    )
}

export default FormUser
