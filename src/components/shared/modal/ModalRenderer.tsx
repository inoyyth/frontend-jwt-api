import React from 'react';
import { useModal } from '../../../hooks/modal/useModal';

interface ModalRendererProps {
    className?: string;
    modalClassName?: string;
    overlayClassName?: string;
}

export const ModalRenderer: React.FC<ModalRendererProps> = ({
    className = '',
    modalClassName = 'modal-dialog',
    overlayClassName = 'modal-overlay'
}) => {
    const { modals } = useModal();

    if (modals.length === 0 || !modals.some(m => m.isOpen)) {
        return null;
    }

    return (
        <div className={`modal-renderer ${className}`}>
            {modals.map((modal) => (
                modal.isOpen && (
                    <div
                        key={modal.id}
                        className={overlayClassName}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000 + modals.indexOf(modal)
                        }}
                    >
                        <div
                            className={modalClassName}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                position: 'relative'
                            }}
                        >
                            {modal.content}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};
