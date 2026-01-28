import React from 'react';
import { useModal } from '../../../hooks/modal/useModal';

interface ModalProps {
    id: string;
    title?: string;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
    id,
    title,
    children,
    className = '',
    showCloseButton = true,
    closeOnOverlayClick = true,
    size = 'md'
}) => {
    const { hideModal, isModalOpen } = useModal();

    if (!isModalOpen(id)) {
        return null;
    }

    const sizeClasses = {
        sm: 'modal-sm',
        md: '',
        lg: 'modal-lg',
        xl: 'modal-xl'
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            hideModal(id);
        }
    };

    return (
        <div
            className={`modal fade show d-block ${className}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleOverlayClick}
        >
            <div className={`modal-dialog modal-dialog-centered ${sizeClasses[size]}`}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    {title && (
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            {showCloseButton && (
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => hideModal(id)}
                                    aria-label="Close"
                                ></button>
                            )}
                        </div>
                    )}
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
