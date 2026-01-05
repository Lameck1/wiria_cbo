import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tender, getTenders, createTender, updateTender, deleteTender } from '@/features/admin/api/tenders.api';
import { uploadFile } from '@/features/admin/api/resources.api'; // Reuse upload
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { extractArray, getErrorMessage } from '@/shared/utils/apiUtils';

export default function TenderManagementPage() {
    const queryClient = useQueryClient();
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTender, setEditingTender] = useState<Tender | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadTenders = async () => {
        setIsLoading(true);
        try {
            const response = await getTenders({ all: true });
            setTenders(extractArray<Tender>(response));
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load tenders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTenders();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tender?')) return;
        try {
            await deleteTender(id);
            notificationService.success('Tender deleted successfully');
            // Invalidate React Query cache so resources page updates
            queryClient.invalidateQueries({ queryKey: ['tenders'] });
            loadTenders();
        } catch (_error) {
            notificationService.error('Failed to delete tender');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-wiria-blue-dark">Tender Management</h2>
                <Button onClick={() => { setEditingTender(null); setShowModal(true); }}>
                    + Advertise New Tender
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Ref No</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Deadline</th>
                                <th className="px-6 py-4">Document</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tenders.map(tender => (
                                <tr key={tender.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm">{tender.refNo}</td>
                                    <td className="px-6 py-4 font-semibold">{tender.title}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(tender.deadline).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        {tender.downloadUrl ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                                                ✓ Uploaded
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                                                ⚠ Missing
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <TenderStatusBadge tender={tender} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { setEditingTender(tender); setShowModal(true); }} className="text-wiria-blue-dark hover:underline text-sm font-bold mr-3">Edit</button>
                                        <button onClick={() => handleDelete(tender.id)} className="text-red-600 hover:underline text-sm font-bold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {tenders.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No tenders advertised yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <TenderModal
                    tender={editingTender}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); loadTenders(); }}
                />
            )}
        </div>
    );
}

function TenderStatusBadge({ tender }: { tender: Tender }) {
    const isExpired = tender.status === 'OPEN' && new Date(tender.deadline) < new Date();
    const status = isExpired ? 'EXPIRED' : tender.status;

    const styles: Record<string, string> = {
        OPEN: 'bg-green-100 text-green-700',
        CLOSED: 'bg-red-100 text-red-700',
        AWARDED: 'bg-blue-100 text-blue-700',
        CANCELLED: 'bg-gray-100 text-gray-700',
        EXPIRED: 'bg-yellow-100 text-yellow-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
}

function TenderModal({ tender, onClose, onSuccess }: { tender: Tender | null; onClose: () => void; onSuccess: () => void }) {
    const queryClient = useQueryClient();
    const [eligibility, setEligibility] = useState<string[]>(tender?.eligibility || ['Legal registration in Kenya', 'Tax compliance']);
    const [docs, setDocs] = useState<string[]>(tender?.requiredDocuments || ['Certificate of Incorporation', 'KRA PIN/Tax Compliance']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => {
            const newArr = [...prev];
            newArr[index] = value;
            return newArr;
        });
    };

    const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev, '']);
    const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => setter(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData: any = Object.fromEntries(formData.entries());

        const fileInput = form.querySelector('#tender-file-input') as HTMLInputElement;
        let downloadUrl = rawData.downloadUrl;

        try {
            if (fileInput?.files?.length) {
                notificationService.info('Uploading document...');
                const file = fileInput.files[0];
                if (file) {
                    const uploadRes = await uploadFile(file, 'tenders');
                    downloadUrl = uploadRes.data.url;
                }
            }

            const data = {
                title: rawData.title,
                refNo: rawData.refNo,
                category: rawData.category,
                estimatedValue: rawData.estimatedValue,
                deadline: new Date(rawData.deadline).toISOString(),
                status: rawData.status,
                submissionMethod: rawData.submissionMethod,
                submissionEmail: rawData.submissionEmail,
                contactPerson: rawData.contactPerson,
                contactPhone: rawData.contactPhone,
                description: rawData.description,
                eligibility: eligibility.filter(i => i.trim()),
                requiredDocuments: docs.filter(i => i.trim()),
                downloadUrl
            };

            if (tender) {
                await updateTender(tender.id, data);
                notificationService.success('Tender updated');
            } else {
                await createTender(data);
                notificationService.success('Tender advertised');
            }
            // Invalidate React Query cache so resources page updates
            queryClient.invalidateQueries({ queryKey: ['tenders'] });
            onSuccess();
        } catch (error: unknown) {
            notificationService.error(getErrorMessage(error, 'Operation failed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-8 pb-4 border-b">
                    <h3 className="text-2xl font-bold">{tender ? 'Edit Tender' : 'Advertise New Tender'}</h3>
                </div>
                <div className="p-8 pt-4 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-wiria-blue-dark border-b pb-1">Basic Information</h4>
                                <div>
                                    <label className="block text-sm font-bold mb-1" htmlFor="tender-title">Tender Title *</label>
                                    <input id="tender-title" name="title" defaultValue={tender?.title} className="w-full border rounded-lg p-2.5" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold mb-1" htmlFor="tender-refNo">Reference No *</label>
                                        <input id="tender-refNo" name="refNo" defaultValue={tender?.refNo} className="w-full border rounded-lg p-2.5" required placeholder="WIRIA/2025/..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1" htmlFor="tender-category">Category *</label>
                                        <input id="tender-category" name="category" defaultValue={tender?.category} className="w-full border rounded-lg p-2.5" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold mb-1" htmlFor="tender-deadline">Deadline *</label>
                                        <input id="tender-deadline" type="datetime-local" name="deadline" defaultValue={tender?.deadline ? new Date(tender.deadline).toISOString().slice(0, 16) : ''} className="w-full border rounded-lg p-2.5" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1" htmlFor="tender-estimatedValue">Est. Value</label>
                                        <input id="tender-estimatedValue" name="estimatedValue" defaultValue={tender?.estimatedValue} className="w-full border rounded-lg p-2.5" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" htmlFor="tender-status">Status</label>
                                    <select id="tender-status" name="status" defaultValue={tender?.status || 'OPEN'} className="w-full border rounded-lg p-2.5">
                                        <option value="OPEN">Open</option>
                                        <option value="CLOSED">Closed</option>
                                        <option value="AWARDED">Awarded</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-wiria-blue-dark border-b pb-1">Submission & Contact</h4>
                                <div>
                                    <label className="block text-sm font-bold mb-1" htmlFor="tender-submissionMethod">Submission Method *</label>
                                    <select id="tender-submissionMethod" name="submissionMethod" defaultValue={tender?.submissionMethod || 'ONLINE'} className="w-full border rounded-lg p-2.5">
                                        <option value="ONLINE">Online (Email)</option>
                                        <option value="PHYSICAL">Physical (Seal Box)</option>
                                        <option value="BOTH">Both</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" htmlFor="tender-submissionEmail">Submission Email *</label>
                                    <input id="tender-submissionEmail" type="email" name="submissionEmail" defaultValue={tender?.submissionEmail || 'tenders@wiria.org'} className="w-full border rounded-lg p-2.5" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold mb-1" htmlFor="tender-contactPerson">Contact Person *</label>
                                        <input id="tender-contactPerson" name="contactPerson" defaultValue={tender?.contactPerson} className="w-full border rounded-lg p-2.5" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1" htmlFor="tender-contactPhone">Contact Phone *</label>
                                        <input id="tender-contactPhone" name="contactPhone" defaultValue={tender?.contactPhone} className="w-full border rounded-lg p-2.5" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" htmlFor="tender-file-input">Tender Document (PDF)</label>
                                    <input type="file" id="tender-file-input" className="w-full border rounded-lg p-2 text-sm" accept=".pdf,.doc,.docx" />
                                    <input type="hidden" name="downloadUrl" defaultValue={tender?.downloadUrl} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Eligibility Criteria</label>
                                {eligibility.map((item, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input aria-label={`Eligibility criteria ${i + 1}`} value={item} onChange={e => handleArrayChange(setEligibility, i, e.target.value)} className="flex-1 border rounded-lg p-2 text-sm" required />
                                        <button type="button" onClick={() => removeArrayItem(setEligibility, i)} className="text-red-500">✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayItem(setEligibility)} className="text-xs text-blue-600 font-bold">+ Add Criteria</button>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Required Documents</label>
                                {docs.map((item, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input aria-label={`Required document ${i + 1}`} value={item} onChange={e => handleArrayChange(setDocs, i, e.target.value)} className="flex-1 border rounded-lg p-2 text-sm" required />
                                        <button type="button" onClick={() => removeArrayItem(setDocs, i)} className="text-red-500">✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayItem(setDocs)} className="text-xs text-blue-600 font-bold">+ Add Document</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="tender-description">Full Description *</label>
                            <textarea id="tender-description" name="description" defaultValue={tender?.description} className="w-full border rounded-lg p-3 h-24 text-sm" required />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (tender ? 'Update Tender' : 'Advertise Tender')}</Button>
                            <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
