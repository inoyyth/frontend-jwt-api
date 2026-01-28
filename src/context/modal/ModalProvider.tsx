import React, { useState, useCallback } from 'react';
import { ModalContext } from './ModalContext';
import type { Modal } from './ModalContext';

interface ModalProviderProps {
    children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modals, setModals] = useState<Modal[]>([]);

    const showModal = useCallback((id: string, content: React.ReactNode, props?: Record<string, unknown>) => {
        setModals(prev => {
            const existingIndex = prev.findIndex(modal => modal.id === id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { id, content, isOpen: true, props };
                return updated;
            }
            return [...prev, { id, content, isOpen: true, props }];
        });
    }, []);

    const hideModal = useCallback((id: string) => {
        setModals(prev => prev.map(modal => 
            modal.id === id ? { ...modal, isOpen: false } : modal
        ));
    }, []);

    const hideAllModals = useCallback(() => {
        setModals(prev => prev.map(modal => ({ ...modal, isOpen: false })));
    }, []);

    const isModalOpen = useCallback((id: string) => {
        const modal = modals.find(m => m.id === id);
        return modal?.isOpen || false;
    }, [modals]);

    const getModalProps = useCallback((id: string) => {
        const modal = modals.find(m => m.id === id);
        return modal?.props;
    }, [modals]);

    return (
        <ModalContext.Provider value={{ 
            modals, 
            showModal, 
            hideModal, 
            hideAllModals, 
            isModalOpen, 
            getModalProps 
        }}>
            {children}
        </ModalContext.Provider>
    );
};