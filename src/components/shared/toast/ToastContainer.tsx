import React from 'react';
import { useToast } from '../../../hooks/toast/useToast';
import { Toast } from './Toast';

interface ToastContainerProps {
    className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ className = '' }) => {
    const {toasts} = useToast();

    const openToasts = toasts.filter(toast => toast.isOpen);

    return (
        <div className={`toast-container position-absolute top-0 end-0 p-3 ${className}`}>
            {openToasts.map(toast => (
                <div key={toast.id}>
                    <Toast id={toast.id} title={toast.props?.title as string} message={toast.message} type={toast.type} />
                </div>
            ))}
        </div>
    );
};