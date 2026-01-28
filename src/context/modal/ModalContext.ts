import { createContext } from 'react';

export interface Modal {
    id: string;
    content: React.ReactNode;
    isOpen: boolean;
    props?: Record<string, unknown>;
}

export interface ModalContextType {
    modals: Modal[];
    showModal: (id: string, content: React.ReactNode, props?: Record<string, unknown>) => void;
    hideModal: (id: string) => void;
    hideAllModals: () => void;
    isModalOpen: (id: string) => boolean;
    getModalProps: (id: string) => Record<string, unknown> | undefined;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);