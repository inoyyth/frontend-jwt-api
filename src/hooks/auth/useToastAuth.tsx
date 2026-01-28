import { useCallback } from 'react';
import { useLogout } from "./useLogout";
import { useToast } from "../toast/useToast";

export const useToastAuth = () => {
    const logout = useLogout();
    const { addToast, removeToast } = useToast();

    return useCallback(() => {
        addToast('Unauthorized',
        <div>
            <p>Your session has expired. Please login again.</p>
            <button className="btn btn-primary" onClick={() => {
                logout();
                removeToast('Unauthorized');
            }}>
                Login
            </button>
        </div>
        , 'danger', {title: 'Error'})
    }, [logout, addToast]);
}