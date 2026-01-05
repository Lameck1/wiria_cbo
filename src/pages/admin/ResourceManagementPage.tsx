import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Resource, getAdminResources, createResource, updateResource, deleteResource, uploadFile } from '@/features/admin/api/resources.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { extractArray, getErrorMessage } from '@/shared/utils/apiUtils';

const CATEGORIES = [
    'GOVERNANCE', 'STRATEGIC', 'FINANCIAL', 'REPORTS', 'POLICIES', 'PUBLICATIONS', 'OTHER'
];

export default function ResourceManagementPage() {
    const queryClient = useQueryClient();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadResources = async () => {
        setIsLoading(true);
        try {
            const response = await getAdminResources();
            setResources(extractArray<Resource>(response));
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load resources');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadResources();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            await deleteResource(id);
            notificationService.success('Resource deleted successfully');
            // Invalidate React Query cache so resources page updates
            queryClient.invalidateQueries({ queryKey: ['resources'] });
            loadResources();
        } catch (_error) {
            notificationService.error('Failed to delete resource');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-wiria-blue-dark">Resource Management</h2>
                <Button onClick={() => { setEditingResource(null); setShowModal(true); }}>
                    + Add New Resource
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Public</th>
                                <th className="px-6 py-4">Downloads</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {resources.map(resource => (
                                <tr key={resource.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold">{resource.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs uppercase">{resource.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{resource.fileType} ({resource.fileSize})</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${resource.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {resource.isPublic ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{resource.downloads || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { setEditingResource(resource); setShowModal(true); }} className="text-wiria-blue-dark hover:underline text-sm font-bold mr-3">Edit</button>
                                        <button onClick={() => handleDelete(resource.id)} className="text-red-600 hover:underline text-sm font-bold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {resources.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No resources found.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <ResourceModal
                    resource={editingResource}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); loadResources(); }}
                />
            )}
        </div>
    );
}

function ResourceModal({ resource, onClose, onSuccess }: { resource: Resource | null; onClose: () => void; onSuccess: () => void }) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData: any = Object.fromEntries(formData.entries());

        const fileInput = form.querySelector('#resource-file-input') as HTMLInputElement;
        let downloadUrl = rawData.downloadUrl;

        try {
            if (fileInput?.files?.length) {
                notificationService.info('Uploading file...');
                const file = fileInput.files[0];
                if (file) {
                    const uploadRes = await uploadFile(file, 'resources');
                    downloadUrl = uploadRes.data.url;
                }

                if (!rawData.fileSize && file) rawData.fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
                if (!rawData.fileType && file) rawData.fileType = file.name.split('.').pop()?.toUpperCase() || 'FILE';
            }

            const data = {
                ...rawData,
                downloadUrl,
                isPublic: rawData.isPublic === 'true',
                keyPoints: rawData.keyPoints ? rawData.keyPoints.split(',').map((p: string) => p.trim()).filter((p: string) => p !== '') : []
            };

            if (resource) {
                await updateResource(resource.id, data);
                notificationService.success('Resource updated successfully');
            } else {
                await createResource(data);
                notificationService.success('Resource added successfully');
            }
            // Invalidate React Query cache so resources page updates
            queryClient.invalidateQueries({ queryKey: ['resources'] });
            onSuccess();
        } catch (error: unknown) {
            notificationService.error(getErrorMessage(error, 'Operation failed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold">{resource ? 'Edit Resource' : 'Add New Resource'}</h3>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="resource-title">Title</label>
                            <input id="resource-title" name="title" defaultValue={resource?.title} className="w-full border rounded-lg p-2.5" required placeholder="e.g. Annual Strategic Report 2024" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1" htmlFor="resource-category">Category</label>
                                <select id="resource-category" name="category" defaultValue={resource?.category || CATEGORIES[0]} className="w-full border rounded-lg p-2.5">
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1" htmlFor="resource-fileType">File Type</label>
                                <input
                                    id="resource-fileType"
                                    name="fileType"
                                    value={selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE' : resource?.fileType || 'PDF'}
                                    className="w-full border rounded-lg p-2.5 bg-gray-50"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Automatically detected from file</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1" htmlFor="resource-fileSize">File Size</label>
                                <input
                                    id="resource-fileSize"
                                    name="fileSize"
                                    value={selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : resource?.fileSize || ''}
                                    className="w-full border rounded-lg p-2.5 bg-gray-50"
                                    placeholder="Auto-filled from upload"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Automatically calculated from file upload</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1" htmlFor="resource-visibility">Visibility</label>
                                <select id="resource-visibility" name="isPublic" defaultValue={resource?.isPublic === false ? 'false' : 'true'} className="w-full border rounded-lg p-2.5">
                                    <option value="true">Public</option>
                                    <option value="false">Private (Internal Only)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="resource-file-input">Resource File</label>
                            <input
                                type="file"
                                id="resource-file-input"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2.5 text-sm"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                            />
                            <p className="text-xs text-gray-500 mt-1">Maximum size: 10MB. File type and size will be detected automatically.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="resource-downloadUrl">Download URL</label>
                            <input id="resource-downloadUrl" name="downloadUrl" defaultValue={resource?.downloadUrl ?? ''} className="w-full border rounded-lg p-2.5" placeholder="Or provide direct URL" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="resource-description">Description</label>
                            <textarea id="resource-description" name="description" defaultValue={resource?.description} className="w-full border rounded-lg p-2.5 h-20" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="resource-summary">Summary</label>
                            <textarea id="resource-summary" name="summary" defaultValue={resource?.summary} className="w-full border rounded-lg p-2.5 h-24" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Key Points (comma separated)</label>
                            <input aria-label="Key points" name="keyPoints" defaultValue={resource?.keyPoints?.join(', ')} className="w-full border rounded-lg p-2.5" placeholder="e.g. Governance, Transparency, Impact" />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Save Resource'}</Button>
                            <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
