import type { ToastType } from "../../../context/toast/ToastContext";
import { useToast } from "../../../hooks/toast/useToast";

interface ToastProps {
    id: string;
    title: string;
    message: React.ReactNode;
    type?: ToastType
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, title, message, type = "primary", duration = 5000 }) => {
    const { removeToast, isToastOpen } = useToast();
    
    if (!isToastOpen(id)) {
        return null;
    }
    
    return (
        <div className={`toast show`} role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay={duration}>
            <div className={`toast-header bg-${type}`}>
                <strong className="me-auto">{title}</strong>
                <button type="button" className="btn-close" onClick={() => removeToast(id)}></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};
