/**
 * Modal Body Component
 * Single responsibility: Scrollable body container for modal content
 */

import { ReactNode } from 'react';

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
    return (
        <div className={`p-6 overflow-y-auto flex-1 min-h-0 ${className}`}>
            {children}
        </div>
    );
}
