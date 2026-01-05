/**
 * Modal Footer Component
 * Single responsibility: Footer container for modal actions
 */

import { ReactNode } from 'react';

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
    return (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0 rounded-b-2xl ${className}`}>
            {children}
        </div>
    );
}
