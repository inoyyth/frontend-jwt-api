import React, { useCallback } from 'react';
import { useModal } from './useModal';

interface ModalOptions {
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
}

export const useModalHelper = () => {
    const { showModal, hideModal } = useModal();

    const createModal = useCallback((
        id: string,
        content: React.ReactNode,
        options: ModalOptions = {}
    ) => {
        showModal(id, content, options as Record<string, unknown>);
    }, [showModal]);

    const createConfirmModal = useCallback((
        id: string,
        message: string,
        onConfirm: () => void,
        options: ModalOptions = {}
    ) => {
        const content = (
            <div className="text-center">
                <p className="mb-4">{message}</p>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => {
                            onConfirm();
                            hideModal(id);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => hideModal(id)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );

        showModal(id, content, { title: 'Confirm', size: 'sm', ...options } as Record<string, unknown>);
    }, [showModal, hideModal]);

    const createAlertModal = useCallback((
        id: string,
        message: string,
        options: ModalOptions = {}
    ) => {
        const content = (
            <div className="text-center">
                <p className="mb-4">{message}</p>
                <button
                    onClick={() => hideModal(id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    OK
                </button>
            </div>
        );

        showModal(id, content, { title: 'Alert', size: 'sm', ...options } as Record<string, unknown>);
    }, [showModal, hideModal]);

    return {
        createModal,
        createConfirmModal,
        createAlertModal,
        hideModal
    };
};
