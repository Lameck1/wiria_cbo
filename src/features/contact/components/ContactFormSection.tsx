/**
 * ContactFormSection Component
 * Enhanced contact form with:
 * - Smart real-time validation
 * - Phone number auto-formatting
 * - Character count for message
 * - Animated send button with success state
 * - Sticky submit on mobile
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactForm } from '../hooks/useContactForm';

interface ValidationErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;

export function ContactFormSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        submitContactForm,
        isSubmitting,
    } = useContactForm();

    // Real-time validation
    useEffect(() => {
        const newErrors: ValidationErrors = {};

        if (touched.has('name') && formData.name.length > 0 && formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (touched.has('email') && formData.email.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (touched.has('phone') && formData.phone.length > 0) {
            const phoneRegex = /^[\d\s+()-]{7,20}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        if (touched.has('subject') && formData.subject.length > 0 && formData.subject.length < 5) {
            newErrors.subject = 'Subject must be at least 5 characters';
        }

        if (touched.has('message') && formData.message.length > 0 && formData.message.length < MESSAGE_MIN_LENGTH) {
            newErrors.message = `Message must be at least ${MESSAGE_MIN_LENGTH} characters`;
        }

        setErrors(newErrors);
    }, [formData, touched]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched(new Set(['name', 'email', 'phone', 'subject', 'message']));

        // Check if form is valid
        if (Object.keys(errors).length > 0) return;

        const dataToSubmit = {
            ...formData,
            phone: formData.phone || undefined,
        };

        const success = await submitContactForm(dataToSubmit);
        if (success) {
            setShowSuccess(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTouched(new Set());

            // Hide success after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Phone number auto-formatting
        if (name === 'phone') {
            const formatted = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, phone: formatted }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (fieldName: string) => {
        setTouched(prev => new Set(prev).add(fieldName));
    };

    const formatPhoneNumber = (value: string): string => {
        // Remove non-digits except + at start
        let cleaned = value.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('+')) {
            cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
        }
        return cleaned;
    };

    const getInputClassName = (fieldName: string) => {
        const base = "form-input block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";
        const hasError = errors[fieldName as keyof ValidationErrors] && touched.has(fieldName);
        const isValid = touched.has(fieldName) && !errors[fieldName as keyof ValidationErrors] && formData[fieldName as keyof typeof formData].length > 0;

        if (hasError) {
            return `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
        }
        if (isValid) {
            return `${base} border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200`;
        }
        return `${base} border-gray-300 focus:border-wiria-yellow focus:ring-2 focus:ring-wiria-yellow/30 focus:shadow-lg focus:shadow-wiria-yellow/10`;
    };

    const messageLength = formData.message.length;
    const messagePercentage = Math.min((messageLength / MESSAGE_MAX_LENGTH) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
        >
            <form id="contact-form" className="space-y-5" onSubmit={handleSubmit}>
                {/* Name Field */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <label htmlFor="contact-name" className="form-label block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="contact-name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        required
                        disabled={isSubmitting}
                        className={getInputClassName('name')}
                        placeholder="Your full name"
                    />
                    <AnimatePresence>
                        {errors.name && touched.has('name') && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Email Field */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                >
                    <label htmlFor="contact-email" className="form-label block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        required
                        disabled={isSubmitting}
                        className={getInputClassName('email')}
                        placeholder="your.email@example.com"
                    />
                    <AnimatePresence>
                        {errors.email && touched.has('email') && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Phone Field */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <label htmlFor="contact-phone" className="form-label block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        id="contact-phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        placeholder="+254 7XX XXX XXX"
                        disabled={isSubmitting}
                        className={getInputClassName('phone')}
                    />
                    <AnimatePresence>
                        {errors.phone && touched.has('phone') && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.phone}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Subject Field */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                >
                    <label htmlFor="contact-subject" className="form-label block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        id="contact-subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={() => handleBlur('subject')}
                        required
                        disabled={isSubmitting}
                        className={getInputClassName('subject')}
                        placeholder="What is this regarding?"
                    />
                    <AnimatePresence>
                        {errors.subject && touched.has('subject') && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.subject}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Message Field with Character Count */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <label htmlFor="contact-message" className="form-label block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        id="contact-message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={() => handleBlur('message')}
                        required
                        disabled={isSubmitting}
                        className={`${getInputClassName('message')} resize-none`}
                        placeholder="Tell us how we can help you..."
                        maxLength={MESSAGE_MAX_LENGTH}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <AnimatePresence>
                            {errors.message && touched.has('message') && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-red-500 text-sm flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <div className="ml-auto flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${messageLength >= MESSAGE_MIN_LENGTH ? 'bg-green-500' : 'bg-wiria-yellow'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${messagePercentage}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                            <span className={`text-xs ${messageLength >= MESSAGE_MIN_LENGTH ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                {messageLength}/{MESSAGE_MAX_LENGTH}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Submit Button - Sticky on Mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                    className="pt-2 lg:pt-0 sticky bottom-4 lg:static z-10"
                >
                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full py-3.5 px-6 bg-green-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                            >
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </motion.svg>
                                Message Sent Successfully!
                            </motion.div>
                        ) : (
                            <motion.button
                                key="submit"
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-wiria-blue-dark to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed lg:bg-gradient-to-r lg:from-wiria-blue-dark lg:to-blue-800 bg-wiria-blue-dark"
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.svg
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </motion.svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Message
                                    </>
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            </form>

        </motion.div>
    );
}
