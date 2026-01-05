/**
 * LoginDropdown Component
 * Dropdown menu for login options
 */

import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/shared/constants/routes';

interface LoginDropdownProps {
    onClose: () => void;
}

export const LoginDropdown = memo(function LoginDropdown({ onClose }: LoginDropdownProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-visible z-[100]"
        >
            <div className="py-2">
                <Link
                    to={ROUTES.MEMBER_LOGIN}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-wiria-blue-dark/5 hover:to-blue-50 hover:text-wiria-blue-dark transition-all duration-200"
                    onClick={onClose}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold">Portal Login</div>
                            <div className="text-xs text-gray-500">For members</div>
                        </div>
                    </div>
                </Link>
                <Link
                    to={ROUTES.STAFF_LOGIN}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-wiria-blue-dark/5 hover:to-blue-50 hover:text-wiria-blue-dark transition-all duration-200"
                    onClick={onClose}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-wiria-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold">Staff Login</div>
                            <div className="text-xs text-gray-500">For team members</div>
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
});
