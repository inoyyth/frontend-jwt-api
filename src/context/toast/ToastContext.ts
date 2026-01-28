import { createContext } from "react";

export type ToastType = 'primary' | 'success' | 'warning' | 'info' | 'danger';

export interface Toast {
    id: string;
    message: React.ReactNode;
    type: ToastType;
    duration?: number;
    isOpen: boolean;
    props?: Record<string, unknown>;
}

export interface ToastContextType {
    toasts: Toast[];
    addToast: (id: string, message: React.ReactNode, type: ToastType, props?: Record<string, unknown>) => void;
    removeToast: (id: string) => void;
    isToastOpen: (id: string) => boolean;
    hideAllToasts: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
