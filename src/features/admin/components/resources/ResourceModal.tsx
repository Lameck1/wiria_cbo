import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Resource,
    createResource,
    updateResource,
    uploadFile,
} from '@/features/admin/api/resources.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { getErrorMessage } from '@/shared/utils/apiUtils';
import { Modal } from '@/shared/components/ui/Modal';

const CATEGORIES = [
    'GOVERNANCE',
    'STRATEGIC',
    'FINANCIAL',
    'REPORTS',
    'POLICIES',
    'PUBLICATIONS',
    'OTHER',
];

interface ResourceModalProps {
    resource: Resource | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function ResourceModal({
    resource,
    onClose,
    onSuccess,
}: ResourceModalProps) {
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
        const rawData = Object.fromEntries(formData.entries()) as Record<string, string>;

        const fileInput = form.querySelector('#resource-file-input') as HTMLInputElement;
        let downloadUrl = rawData['downloadUrl'] || '';

        try {
            if (fileInput?.files?.length) {
                notificationService.info('Uploading file...');
                const file = fileInput.files[0];
                if (file) {
                    const uploadRes = await uploadFile(file, 'resources');
                    downloadUrl = uploadRes.data.url;
                }

                if (!rawData['fileSize'] && file)
                    rawData['fileSize'] = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
                if (!rawData['fileType'] && file)
                    rawData['fileType'] = file.name.split('.').pop()?.toUpperCase() || 'FILE';
            }

            const data = {
                title: rawData['title'] || '',
                category: rawData['category'] || '',
                fileType: rawData['fileType'] || '',
                fileSize: rawData['fileSize'] || '',
                description: rawData['description'] || '',
                summary: rawData['summary'],
                downloadUrl,
                isPublic: rawData['isPublic'] === 'true',
                keyPoints: rawData['keyPoints']
                    ? rawData['keyPoints']
                        .split(',')
                        .map((p: string) => p.trim())
                        .filter((p: string) => p !== '')
                    : [],
            };

            if (resource) {
                await updateResource(resource.id, data);
                notificationService.success('Resource updated successfully');
            } else {
                await createResource(data);
                notificationService.success('Resource added successfully');
            }

            queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
            onSuccess();
        } catch (error: unknown) {
            notificationService.error(getErrorMessage(error, 'Operation failed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={resource ? 'Edit Resource' : 'Add New Resource'}
            size="3xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-bold" htmlFor="resource-title">
                        Title
                    </label>
                    <input
                        id="resource-title"
                        name="title"
                        defaultValue={resource?.title}
                        className="w-full rounded-lg border p-2.5"
                        required
                        placeholder="e.g. Annual Strategic Report 2024"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-bold" htmlFor="resource-category">
                            Category
                        </label>
                        <select
                            id="resource-category"
                            name="category"
                            defaultValue={resource?.category || CATEGORIES[0]}
                            className="w-full rounded-lg border p-2.5"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-bold" htmlFor="resource-fileType">
                            File Type
                        </label>
                        <input
                            id="resource-fileType"
                            name="fileType"
                            value={
                                selectedFile
                                    ? selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'
                                    : resource?.fileType || 'PDF'
                            }
                            className="w-full rounded-lg border bg-gray-50 p-2.5"
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">Automatically detected from file</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-bold" htmlFor="resource-fileSize">
                            File Size
                        </label>
                        <input
                            id="resource-fileSize"
                            name="fileSize"
                            value={
                                selectedFile
                                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                                    : resource?.fileSize || ''
                            }
                            className="w-full rounded-lg border bg-gray-50 p-2.5"
                            placeholder="Auto-filled from upload"
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">Automatically calculated from file upload</p>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-bold" htmlFor="resource-visibility">
                            Visibility
                        </label>
                        <select
                            id="resource-visibility"
                            name="isPublic"
                            defaultValue={resource?.isPublic === false ? 'false' : 'true'}
                            className="w-full rounded-lg border p-2.5"
                        >
                            <option value="true">Public</option>
                            <option value="false">Private (Internal Only)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold" htmlFor="resource-file-input">
                        Resource File
                    </label>
                    <input
                        type="file"
                        id="resource-file-input"
                        onChange={handleFileChange}
                        className="w-full rounded-lg border p-2.5 text-sm"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Maximum size: 10MB. File type and size will be detected automatically.
                    </p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold" htmlFor="resource-downloadUrl">
                        Download URL
                    </label>
                    <input
                        id="resource-downloadUrl"
                        name="downloadUrl"
                        defaultValue={resource?.downloadUrl ?? ''}
                        className="w-full rounded-lg border p-2.5"
                        placeholder="Or provide direct URL"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold" htmlFor="resource-description">
                        Description
                    </label>
                    <textarea
                        id="resource-description"
                        name="description"
                        defaultValue={resource?.description}
                        className="h-20 w-full rounded-lg border p-2.5"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-bold" htmlFor="resource-summary">
                        Summary
                    </label>
                    <textarea
                        id="resource-summary"
                        name="summary"
                        defaultValue={resource?.summary}
                        className="h-24 w-full rounded-lg border p-2.5"
                    />
                </div>

                <div>
                    <label htmlFor="resource-keyPoints" className="mb-1 block text-sm font-bold">Key Points (comma separated)</label>
                    <input
                        id="resource-keyPoints"
                        name="keyPoints"
                        defaultValue={resource?.keyPoints?.join(', ')}
                        className="w-full rounded-lg border p-2.5"
                        placeholder="e.g. Governance, Transparency, Impact"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Save Resource'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        fullWidth
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
