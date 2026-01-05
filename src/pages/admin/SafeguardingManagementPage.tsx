/**
 * Safeguarding Reports Management Page
 * Admin view for managing safeguarding reports
 */

import { useCallback, useEffect, useState } from 'react';
import {
    getSafeguardingReports,
    updateSafeguardingReport,
    resolveSafeguardingReport,
    SafeguardingReport,
} from '@/features/admin/api/safeguarding.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    INVESTIGATING: 'bg-orange-100 text-orange-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-500',
};

const PRIORITY_COLORS: Record<string, string> = {
    CRITICAL: 'bg-red-600 text-white',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-yellow-500 text-white',
    LOW: 'bg-green-500 text-white',
};

const INCIDENT_TYPES: Record<string, string> = {
    CHILD_PROTECTION: 'Child Protection',
    SEXUAL_EXPLOITATION: 'Sexual Exploitation',
    HARASSMENT: 'Harassment',
    DISCRIMINATION: 'Discrimination',
    FRAUD: 'Fraud',
    OTHER: 'Other',
};

export default function SafeguardingManagementPage() {
    const [reports, setReports] = useState<SafeguardingReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [selectedReport, setSelectedReport] = useState<SafeguardingReport | null>(null);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolution, setResolution] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: { status?: string; priority?: string } = {};
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;
            const data = await getSafeguardingReports(Object.keys(params).length ? params : undefined);
            setReports(data);
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load reports');
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, priorityFilter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateSafeguardingReport(id, { status: newStatus as SafeguardingReport['status'] });
            notificationService.success('Status updated');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to update status');
        }
    };

    const handleResolve = async () => {
        if (!selectedReport || !resolution.trim()) return;
        setIsSubmitting(true);
        try {
            await resolveSafeguardingReport(selectedReport.id, resolution);
            notificationService.success('Report resolved');
            setShowResolveModal(false);
            setResolution('');
            setSelectedReport(null);
            loadData();
        } catch (_error) {
            notificationService.error('Failed to resolve report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const criticalCount = reports.filter(r => r.priority === 'CRITICAL' && r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
    const openCount = reports.filter(r => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-wiria-blue-dark mb-2">Safeguarding Reports</h2>
                <p className="text-gray-600">Manage and respond to safeguarding concerns.</p>
                <div className="flex gap-3 mt-2">
                    {criticalCount > 0 && (
                        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                            {criticalCount} critical
                        </span>
                    )}
                    {openCount > 0 && (
                        <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                            {openCount} open case{openCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label htmlFor="status-filter" className="sr-only">
                        Filter reports by status
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="INVESTIGATING">Investigating</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="priority-filter" className="sr-only">
                        Filter reports by priority
                    </label>
                    <select
                        id="priority-filter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">All Priorities</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No reports found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reports.map((report) => (
                                <tr key={report.id} className={`hover:bg-gray-50 ${report.priority === 'CRITICAL' ? 'bg-red-50' : ''}`}>
                                    <td className="px-6 py-4 font-mono text-sm">{report.referenceNumber}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {INCIDENT_TYPES[report.incidentType] || report.incidentType}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${PRIORITY_COLORS[report.priority]}`}>
                                            {report.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[report.status]}`}>
                                            {report.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{formatDate(report.createdAt)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedReport(report)}
                                            className="text-wiria-blue-dark hover:underline text-sm font-bold mr-3"
                                        >
                                            View
                                        </button>
                                        {report.status !== 'RESOLVED' && report.status !== 'CLOSED' && (
                                            <button
                                                onClick={() => { setSelectedReport(report); setShowResolveModal(true); }}
                                                className="text-green-600 hover:underline text-sm font-bold"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Report Modal */}
            {selectedReport && !showResolveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Report: {selectedReport.referenceNumber}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${PRIORITY_COLORS[selectedReport.priority]}`}>
                                        {selectedReport.priority}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[selectedReport.status]}`}>
                                        {selectedReport.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Incident Type</p>
                                    <p className="font-semibold">{INCIDENT_TYPES[selectedReport.incidentType]}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Incident Date</p>
                                    <p>{formatDate(selectedReport.incidentDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Location</p>
                                    <p>{selectedReport.incidentLocation}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Reported</p>
                                    <p>{formatDate(selectedReport.createdAt)}</p>
                                </div>
                                {!selectedReport.isAnonymous && (
                                    <>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Reporter Name</p>
                                            <p>{selectedReport.reporterName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Reporter Contact</p>
                                            <p>{selectedReport.reporterEmail}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Description</p>
                                <p className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedReport.description}</p>
                            </div>
                            {selectedReport.personsInvolved && (
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Persons Involved</p>
                                    <p className="bg-gray-50 p-4 rounded-lg">{selectedReport.personsInvolved}</p>
                                </div>
                            )}
                            {selectedReport.resolution && (
                                <div>
                                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Resolution</p>
                                    <p className="bg-green-50 p-4 rounded-lg text-green-700">{selectedReport.resolution}</p>
                                </div>
                            )}

                            {/* Status Update */}
                            {selectedReport.status !== 'RESOLVED' && selectedReport.status !== 'CLOSED' && (
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">Update Status</p>
                                    <div className="flex gap-2">
                                        {['PENDING', 'UNDER_REVIEW', 'INVESTIGATING'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(selectedReport.id, status)}
                                                className={`px-3 py-1 rounded text-sm font-bold ${selectedReport.status === status ? STATUS_COLORS[status] : 'bg-gray-100 text-gray-600'}`}
                                            >
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex gap-3">
                            {selectedReport.status !== 'RESOLVED' && selectedReport.status !== 'CLOSED' && (
                                <Button onClick={() => setShowResolveModal(true)}>Mark as Resolved</Button>
                            )}
                            <Button variant="secondary" onClick={() => setSelectedReport(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Modal */}
            {showResolveModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">Resolve Report</h3>
                            <p className="text-sm text-gray-500">Report: {selectedReport.referenceNumber}</p>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-bold mb-2">Resolution Details *</label>
                            <textarea
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                className="w-full border rounded-lg p-3 h-40"
                                placeholder="Describe how this issue was resolved..."
                                required
                            />
                        </div>
                        <div className="p-6 border-t flex gap-3">
                            <Button onClick={handleResolve} disabled={isSubmitting || !resolution.trim()}>
                                {isSubmitting ? 'Saving...' : 'Confirm Resolution'}
                            </Button>
                            <Button variant="secondary" onClick={() => { setShowResolveModal(false); setResolution(''); }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
