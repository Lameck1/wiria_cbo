import { useState } from 'react';
import { Application, updateApplicationStatus } from '@/features/admin/api/opportunities.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';

interface ApplicationModalProps {
    application: Application;
    onClose: () => void;
    onSuccess: () => void;
}

export function ApplicationReviewModal({ application, onClose, onSuccess }: ApplicationModalProps) {
    const [status, setStatus] = useState(application.status);
    const [notes, setNotes] = useState(application.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            await updateApplicationStatus(application.id, status, notes);
            notificationService.success('Application status updated');
            onSuccess();
        } catch (_error) {
            notificationService.error('Failed to update status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFullUrl = (path?: string) => {
        if (!path) return '#';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${path}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-8 pb-4 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Application Review</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <div className="p-8 pt-4 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Applicant</p>
                                <p className="text-lg font-semibold">{application.firstName} {application.lastName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Current Status</p>
                                <StatusBadge status={application.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                                <p className="text-sm">{application.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Phone</p>
                                <p className="text-sm">{application.phone}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Applied For</p>
                            <p className="text-sm font-semibold">{application.career?.title || application.opportunity?.title || 'Unknown Position'}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl max-h-60 overflow-y-auto border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Cover Letter / Statement</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.coverLetter || 'No cover letter provided.'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-600 uppercase mb-2">Resume / CV</p>
                                {application.resumeUrl ? (
                                    <a href={getFullUrl(application.resumeUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center text-wiria-blue-dark font-bold hover:underline">
                                        <span className="mr-2">📄</span> View CV
                                    </a>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No CV provided</p>
                                )}
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <p className="text-xs font-bold text-green-600 uppercase mb-2">Additional Documents</p>
                                {application.additionalDocs && application.additionalDocs.length > 0 ? (
                                    <div className="space-y-1">
                                        {application.additionalDocs.map((doc, i) => (
                                            <a key={i} href={getFullUrl(doc)} target="_blank" rel="noreferrer" className="block text-sm text-wiria-blue-dark font-semibold hover:underline">
                                                🔗 Document {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">None</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Reviewer Notes</p>
                            <textarea
                                className="w-full border rounded-lg p-3 text-sm h-24"
                                placeholder="Add private notes about this applicant..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <label htmlFor="application-status" className="sr-only">
                                Application status
                            </label>
                            <select
                                id="application-status"
                                className="flex-1 border rounded-lg p-2 font-semibold bg-white"
                                value={status}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => setStatus(e.target.value as any)}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="INTERVIEWED">Interviewed</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <Button onClick={handleUpdate} disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Review'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        UNDER_REVIEW: 'bg-blue-100 text-blue-700',
        ACCEPTED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700',
        SHORTLISTED: 'bg-purple-100 text-purple-700',
        INTERVIEWED: 'bg-indigo-100 text-indigo-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
}
