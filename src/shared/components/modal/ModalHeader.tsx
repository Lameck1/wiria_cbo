/**
 * Modal Header Component
 * Single responsibility: Render modal header with close button
 * Supports both title prop and children for flexibility
 */

import { ReactNode } from 'react';

interface ModalHeaderProps {
    title?: string;
    children?: ReactNode;
    onClose: () => void;
    className?: string;
}

export function ModalHeader({ title, children, onClose, className = '' }: ModalHeaderProps) {
    return (
        <div className={`relative px-6 py-5 flex-shrink-0 rounded-t-2xl border-b border-gray-100 ${className}`}>
            {title ? (
                <h2 className="text-2xl font-bold text-wiria-blue-dark pr-12">{title}</h2>
            ) : (
                children
            )}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600 hover:text-gray-800"
                aria-label="Close modal"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
