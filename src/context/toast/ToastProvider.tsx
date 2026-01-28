import { useCallback, useState } from "react";
import { ToastContext, type Toast, type ToastType } from "./ToastContext";

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((id: string, message: React.ReactNode, type: ToastType, props?: Record<string, unknown>) => {
        setToasts(prev => {
            const existingIndex = prev.findIndex(toast => toast.id === id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { id, message, type, isOpen: true, props };
                return updated;
            }
            return [...prev, { id, message, type, isOpen: true, props }];
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const isToastOpen = useCallback((id: string) => {
        const toast = toasts.find(t => t.id === id);
        return toast?.isOpen || false;
    }, [toasts]);

    const hideAllToasts = useCallback(() => {
        setToasts(prev => prev.map(toast => ({ ...toast, isOpen: false })));
    }, []);
    

    return (
       <ToastContext.Provider value={{ toasts, addToast, removeToast, isToastOpen, hideAllToasts }}>
            {children}
        </ToastContext.Provider>
    );
}
