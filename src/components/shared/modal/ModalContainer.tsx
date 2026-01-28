import React from 'react';
import { useModal } from '../../../hooks/modal/useModal';
import { Modal } from './Modal';

interface ModalContainerProps {
    className?: string;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ className = '' }) => {
    const { modals } = useModal();

    const openModals = modals.filter(modal => modal.isOpen);

    if (openModals.length === 0) {
        return null;
    }

    return (
        <div className={`modal-container ${className}`}>
            {openModals.map((modal) => (
                <Modal
                    key={modal.id}
                    id={modal.id}
                    title={modal.props?.title as string}
                    size={modal.props?.size as 'sm' | 'md' | 'lg' | 'xl'}
                    showCloseButton={modal.props?.showCloseButton !== false}
                    closeOnOverlayClick={modal.props?.closeOnOverlayClick !== false}
                >
                    {modal.content}
                </Modal>
            ))}
        </div>
    );
};
