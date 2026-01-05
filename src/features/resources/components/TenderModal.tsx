/**
 * TenderModal Component
 * Full tender details view with download and submission info
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalOverlay, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/modal';
import { getFullFileUrl, hasValidFileUrl } from '@/shared/utils/getBackendUrl';
import type { Tender } from '../hooks/useTenders';

interface TenderModalProps {
    tender: Tender | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TenderModal({ tender, isOpen, onClose }: TenderModalProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(true);

    if (!isOpen || !tender) return null;

    const isPDF = true; // Tender documents are typically PDFs
    const hasDocument = hasValidFileUrl(tender.downloadUrl);
    const fullUrl = getFullFileUrl(tender.downloadUrl);

    const handleDownload = () => {
        if (!hasDocument) return;
        window.open(getFullFileUrl(tender.downloadUrl), '_blank');
    };

    const deadlineDate = new Date(tender.deadline);

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="3xl">
            <ModalHeader onClose={onClose} className="bg-gradient-to-r from-wiria-blue-dark to-blue-700 text-white">
                {/* Ref Number Badge */}
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-mono mb-3 backdrop-blur-sm">
                    {tender.refNo}
                </span>

                {/* Title */}
                <h2 className="text-2xl font-bold pr-12">{tender.title}</h2>

                {/* Category & Status */}
                <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
                    <span>{tender.category}</span>
                    <span>•</span>
                    <span className={tender.status === 'OPEN' ? 'text-green-300' : 'text-gray-300'}>
                        {tender.status}
                    </span>
                </div>
            </ModalHeader>

            <ModalBody>
                {/* PDF Preview Toggle - Only show if document exists */}
                {isPDF && hasDocument && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Tender Document (PDF)</span>
                            </div>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 text-sm font-semibold text-wiria-blue-dark hover:text-wiria-yellow transition-colors"
                            >
                                {showPreview ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                        Hide Preview
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Preview PDF
                                    </>
                                )}
                            </button>
                        </div>

                        {/* PDF Preview Iframe */}
                        <AnimatePresence>
                            {showPreview && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 400 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 relative rounded-lg overflow-hidden border border-gray-200"
                                >
                                    {previewLoading && (
                                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-10 h-10 border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark rounded-full animate-spin mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">Loading preview...</p>
                                            </div>
                                        </div>
                                    )}
                                    <iframe
                                        src={`${fullUrl}#view=FitH`}
                                        className="w-full h-full"
                                        title={`Preview of ${tender.title}`}
                                        onLoad={() => setPreviewLoading(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* No Document Warning */}
                {!hasDocument && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-yellow-800">Document Pending Upload</p>
                            <p className="text-sm text-yellow-600">The file for this tender has not been uploaded yet.</p>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Category</p>
                            <p className="font-semibold text-gray-700">{tender.category}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Estimated Value</p>
                            <p className="font-semibold text-gray-700">{tender.estimatedValue}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Deadline</p>
                            <p className="font-semibold text-red-600">
                                {deadlineDate.toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Status</p>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${tender.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {tender.status}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600">{tender.description}</p>
                    </div>

                    {/* Eligibility */}
                    {tender.eligibility && tender.eligibility.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Eligibility Requirements</h4>
                            <ul className="space-y-2">
                                {tender.eligibility.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-600 text-sm">
                                        <svg className="w-5 h-5 text-wiria-yellow flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Required Documents */}
                    {tender.requiredDocuments && tender.requiredDocuments.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Required Documents</h4>
                            <ul className="space-y-2">
                                {tender.requiredDocuments.map((doc, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-600 text-sm">
                                        <svg className="w-5 h-5 text-wiria-blue-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Submission Info */}
                    <div className="bg-wiria-blue-dark/5 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-wiria-blue-dark">Submission Information</h4>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p><span className="font-medium">Method:</span> {tender.submissionMethod}</p>
                            <p><span className="font-medium">Address:</span> {tender.submissionAddress}</p>
                            <p><span className="font-medium">Email:</span>{' '}
                                <a href={`mailto:${tender.submissionEmail}`} className="text-wiria-blue-dark hover:underline">
                                    {tender.submissionEmail}
                                </a>
                            </p>
                            <p><span className="font-medium">Contact:</span> {tender.contactPerson} ({tender.contactPhone})</p>
                        </div>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className="flex flex-col sm:flex-row gap-3">
                {hasDocument ? (
                    <button
                        onClick={handleDownload}
                        className="flex-1 bg-wiria-blue-dark text-white font-bold py-3 px-6 rounded-full hover:bg-wiria-yellow transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Tender Documents
                    </button>
                ) : (
                    <div className="flex-1 bg-gray-100 text-gray-500 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 cursor-not-allowed">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No Document Uploaded Yet
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors"
                >
                    Close
                </button>
            </ModalFooter>
        </ModalOverlay>
    );
}
