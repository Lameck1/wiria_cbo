import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type {
    Resource} from '@/features/admin/api/resources.api';
import {
    createResource,
    updateResource,
    uploadFile,
} from '@/features/admin/api/resources.api';
import { FormModal, type FieldConfig } from '@/shared/components/modals/FormModal';
import { notificationService } from '@/shared/services/notification/notificationService';
import { getErrorMessage } from '@/shared/utils/apiUtils';

const CATEGORIES = [
    'GOVERNANCE',
    'STRATEGIC',
    'FINANCIAL',
    'REPORTS',
    'POLICIES',
    'PUBLICATIONS',
    'OTHER',
];

function buildResourceFields(options: { selectedFile: File | null; resource: Resource | null }): FieldConfig[] {
    const { selectedFile, resource } = options;

    return [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
            placeholder: 'e.g. Annual Strategic Report 2024',
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            options: CATEGORIES.map((category) => ({ value: category, label: category })),
        },
        {
            name: 'fileType',
            label: 'File Type',
            type: 'text',
            placeholder: 'Automatically detected from file',
            defaultValue: selectedFile
                ? selectedFile.name.split('.').pop()?.toUpperCase() ?? 'FILE'
                : resource?.fileType ?? 'PDF',
        },
        {
            name: 'fileSize',
            label: 'File Size',
            type: 'text',
            placeholder: 'Auto-filled from upload',
            defaultValue: selectedFile
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                : resource?.fileSize ?? '',
        },
        {
            name: 'isPublic',
            label: 'Visibility',
            type: 'select',
            required: true,
            options: [
                { value: 'true', label: 'Public' },
                { value: 'false', label: 'Private (Internal Only)' },
            ],
            defaultValue: resource?.isPublic === false ? 'false' : 'true',
        },
        {
            name: 'downloadUrl',
            label: 'Download URL',
            type: 'text',
            placeholder: 'Or provide direct URL',
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: true,
            rows: 3,
        },
        {
            name: 'summary',
            label: 'Summary',
            type: 'textarea',
            rows: 4,
        },
        {
            name: 'keyPoints',
            label: 'Key Points (comma separated)',
            type: 'text',
            placeholder: 'e.g. Governance, Transparency, Impact',
        },
    ];
}

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file ?? null);
    };

    const handleSubmit = async (formData: Record<string, unknown>) => {
        let downloadUrl = (formData['downloadUrl'] as string) || '';

        // Handle file upload if file is selected
        if (selectedFile) {
            notificationService.info('Uploading file...');
            const uploadResult = await uploadFile(selectedFile, 'resources');
            downloadUrl = uploadResult.data.url;

            formData['fileSize'] ??= `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
            formData['fileType'] ??= selectedFile.name.split('.').pop()?.toUpperCase() ?? 'FILE';
        }

        const data = {
            title: formData['title'] as string || '',
            category: formData['category'] as string || '',
            fileType: formData['fileType'] as string || '',
            fileSize: formData['fileSize'] as string || '',
            description: formData['description'] as string || '',
            summary: formData['summary'] as string,
            downloadUrl,
            isPublic: formData['isPublic'] === 'true',
            keyPoints: formData['keyPoints']
                ? (formData['keyPoints'] as string)
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

        void queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
        onSuccess();
    };

    const handleFormSubmit = async (formData: Record<string, unknown>) => {
        try {
            await handleSubmit(formData);
        } catch (error: unknown) {
            notificationService.error(getErrorMessage(error, 'Operation failed'));
            throw error;
        }
    };

    const fields: FieldConfig[] = buildResourceFields({ selectedFile, resource });

    return (
        <FormModal
            isOpen={true}
            onClose={onClose}
            onSubmit={handleFormSubmit}
            title={resource ? 'Edit Resource' : 'Add New Resource'}
            fields={fields}
            initialData={resource ? { ...resource } : undefined}
            submitLabel="Save Resource"
        >
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
        </FormModal>
    );
}
