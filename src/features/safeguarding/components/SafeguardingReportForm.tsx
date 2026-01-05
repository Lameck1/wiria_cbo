/**
 * SafeguardingReportForm Component
 * Enhanced with:
 * - Progress steps indicator (2)
 * - Security indicator for anonymous mode (6)
 * - Staggered form animations (7)
 * - Category pills for mobile (12)
 * - Animated success state (9)
 * - Sticky submit button on mobile (11)
 */

import { useState, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeguardingReport, SafeguardingReportData } from '../hooks/useSafeguardingReport';

const CONCERN_CATEGORIES = [
    { value: 'CHILD_PROTECTION', label: 'Child Protection', icon: '🧒' },
    { value: 'SEXUAL_EXPLOITATION', label: 'Sexual Exploitation', icon: '⚠️' },
    { value: 'HARASSMENT', label: 'Harassment', icon: '😰' },
    { value: 'DISCRIMINATION', label: 'Discrimination', icon: '🚫' },
    { value: 'FRAUD', label: 'Financial Misconduct', icon: '💰' },
    { value: 'OTHER', label: 'Other Concern', icon: '📋' },
];

const REPORTER_RELATIONS = [
    { value: 'Witness', label: 'Witness' },
    { value: 'Victim', label: 'Victim/Survivor' },
    { value: 'Parent/Guardian', label: 'Parent/Guardian' },
    { value: 'Staff', label: 'Staff Member' },
    { value: 'Volunteer', label: 'Volunteer' },
    { value: 'Community Member', label: 'Community Member' },
    { value: 'Other', label: 'Other' },
];

// Form steps
type FormStep = 'reporter' | 'details';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SafeguardingReportForm() {
    const [currentStep, setCurrentStep] = useState<FormStep>('reporter');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [formData, setFormData] = useState({
        reporterName: '',
        reporterEmail: '',
        reporterPhone: '',
        reporterRelation: '',
        category: '',
        incidentDate: '',
        location: '',
        personsInvolved: '',
        description: '',
    });
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const { submitReport, isSubmitting, submittedReference, resetSubmission } = useSafeguardingReport();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCategorySelect = (category: string) => {
        setFormData(prev => ({ ...prev, category }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEvidenceFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setEvidenceFile(null);
    };

    const handleNextStep = () => {
        setCurrentStep('details');
    };

    const handlePrevStep = () => {
        setCurrentStep('reporter');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data: SafeguardingReportData = {
            isAnonymous,
            category: formData.category,
            description: formData.description,
            ...(formData.incidentDate && { incidentDate: formData.incidentDate }),
            ...(formData.location && { location: formData.location }),
            ...(formData.personsInvolved && { personsInvolved: formData.personsInvolved }),
            ...(!isAnonymous && {
                reporterName: formData.reporterName || undefined,
                reporterEmail: formData.reporterEmail || undefined,
                reporterPhone: formData.reporterPhone || undefined,
                reporterRelation: formData.reporterRelation || undefined,
            }),
        };

        const success = await submitReport(data, evidenceFile || undefined);
        if (success) {
            setShowSuccess(true);
        }
    };

    const handleNewReport = () => {
        resetSubmission();
        setShowSuccess(false);
        setFormData({
            reporterName: '',
            reporterEmail: '',
            reporterPhone: '',
            reporterRelation: '',
            category: '',
            incidentDate: '',
            location: '',
            personsInvolved: '',
            description: '',
        });
        setEvidenceFile(null);
        setIsAnonymous(false);
        setCurrentStep('reporter');
    };

    // Progress calculation
    const progressPercentage = currentStep === 'reporter' ? 50 : 100;

    // Success state with animation
    if (submittedReference || showSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                    <motion.svg
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-12 h-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </motion.svg>
                </motion.div>
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-gray-800 mb-2"
                >
                    Report Submitted Successfully
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 mb-6"
                >
                    Thank you for bringing this to our attention.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-xl inline-block shadow-inner"
                >
                    <p className="text-sm text-gray-600 mb-1">Your Reference Number:</p>
                    <p className="text-3xl font-bold text-slate-700 tracking-wider">{submittedReference}</p>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-gray-500 mt-4"
                >
                    Please save this reference number to check the status of your report.
                </motion.p>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={handleNewReport}
                    className="mt-6 text-wiria-blue-dark hover:text-wiria-yellow font-medium transition-colors inline-flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Submit Another Report
                </motion.button>
            </motion.div>
        );
    }

    const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form id="safeguarding-form" ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
            {/* Progress Steps Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${currentStep === 'reporter' ? 'text-slate-700' : 'text-gray-400'}`}>
                        1. Reporter Info
                    </span>
                    <span className={`text-sm font-medium ${currentStep === 'details' ? 'text-slate-700' : 'text-gray-400'}`}>
                        2. Concern Details
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-slate-600 to-slate-700 rounded-full"
                        initial={{ width: '50%' }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Reporter Information */}
                {currentStep === 'reporter' && (
                    <motion.div
                        key="reporter"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Anonymous Toggle with Security Indicator */}
                        <motion.div variants={staggerItem} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="isAnonymous"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 text-slate-600 rounded border-gray-300 focus:ring-slate-500"
                                />
                                <span className="ml-3 flex-1">
                                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                                        Report Anonymously
                                        {isAnonymous && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                                Protected
                                            </motion.span>
                                        )}
                                    </span>
                                    <span className="block text-sm text-gray-500 mt-1">
                                        Your identity will not be recorded. However, we won't be able to contact you for follow-up.
                                    </span>
                                </span>
                            </label>

                            {/* Security Indicator */}
                            <AnimatePresence>
                                {isAnonymous && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
                                    >
                                        <p className="text-sm text-green-700 flex items-center gap-2">
                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span><strong>Your identity is protected.</strong> No personal data will be stored with this report.</span>
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Reporter Information Fields */}
                        <AnimatePresence>
                            {!isAnonymous && (
                                <motion.div
                                    variants={staggerItem}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 border-l-4 border-wiria-blue-dark pl-4"
                                >
                                    <h3 className="font-semibold text-wiria-blue-dark">Your Information</h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="reporterName" className={labelClass}>Your Name</label>
                                            <input
                                                type="text"
                                                id="reporterName"
                                                name="reporterName"
                                                value={formData.reporterName}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="reporterEmail" className={labelClass}>Your Email</label>
                                            <input
                                                type="email"
                                                id="reporterEmail"
                                                name="reporterEmail"
                                                value={formData.reporterEmail}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="reporterPhone" className={labelClass}>Phone (Optional)</label>
                                            <input
                                                type="tel"
                                                id="reporterPhone"
                                                name="reporterPhone"
                                                value={formData.reporterPhone}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                className={inputClass}
                                                placeholder="+254 7XX XXX XXX"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="reporterRelation" className={labelClass}>Your Relation</label>
                                            <select
                                                id="reporterRelation"
                                                name="reporterRelation"
                                                value={formData.reporterRelation}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                className={inputClass}
                                            >
                                                <option value="">Select...</option>
                                                {REPORTER_RELATIONS.map(rel => (
                                                    <option key={rel.value} value={rel.value}>{rel.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Next Step Button */}
                        <motion.div variants={staggerItem}>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Concern Details
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Step 2: Concern Details */}
                {currentStep === 'details' && (
                    <motion.div
                        key="details"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* Category Pills */}
                        <motion.div variants={staggerItem}>
                            <label className={labelClass}>
                                Category of Concern <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {CONCERN_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => handleCategorySelect(cat.value)}
                                        disabled={isSubmitting}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${formData.category === cat.value
                                                ? 'border-slate-600 bg-slate-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            } disabled:opacity-50`}
                                    >
                                        <span className="text-xl">{cat.icon}</span>
                                        <span className={`block text-sm mt-1 font-medium ${formData.category === cat.value ? 'text-slate-700' : 'text-gray-600'
                                            }`}>
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Date and Location */}
                        <motion.div variants={staggerItem} className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="incidentDate" className={labelClass}>When did this occur?</label>
                                <input
                                    type="date"
                                    id="incidentDate"
                                    name="incidentDate"
                                    value={formData.incidentDate}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className={labelClass}>Where did this happen?</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={inputClass}
                                    placeholder="Location or area"
                                />
                            </div>
                        </motion.div>

                        {/* Persons Involved */}
                        <motion.div variants={staggerItem}>
                            <label htmlFor="personsInvolved" className={labelClass}>Person(s) Involved</label>
                            <textarea
                                id="personsInvolved"
                                name="personsInvolved"
                                rows={2}
                                value={formData.personsInvolved}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={inputClass}
                                placeholder="Names or descriptions of people involved"
                            />
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={staggerItem}>
                            <label htmlFor="description" className={labelClass}>
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                minLength={20}
                                disabled={isSubmitting}
                                className={inputClass}
                                placeholder="Please describe what happened in detail..."
                            />
                            <p className="text-sm text-gray-500 mt-1">Minimum 20 characters required</p>
                        </motion.div>

                        {/* File Upload */}
                        <motion.div variants={staggerItem}>
                            <label className={labelClass}>Supporting Evidence (Optional)</label>
                            {evidenceFile ? (
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-green-800">{evidenceFile.name}</p>
                                            <p className="text-sm text-green-600">{(evidenceFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="evidence"
                                        onChange={handleFileChange}
                                        disabled={isSubmitting}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-slate-400 hover:bg-gray-50 transition-all">
                                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-gray-600 font-medium">Click or drag file to upload</p>
                                        <p className="text-sm text-gray-400 mt-1">Images, PDF, Word (Max 10MB)</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Action Buttons - Sticky on Mobile */}
                        <motion.div
                            variants={staggerItem}
                            className="pt-4 sticky bottom-4 lg:static z-10"
                        >
                            <div className="flex gap-3 bg-white/90 backdrop-blur-sm p-2 -m-2 rounded-xl lg:bg-transparent lg:p-0 lg:m-0">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="flex-1 py-3.5 px-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.category || !formData.description}
                                    className="flex-[2] py-3.5 px-6 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Submit Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}
