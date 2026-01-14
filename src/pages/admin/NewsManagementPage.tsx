import { useEffect, useState, useCallback, memo } from 'react';

import {
  NewsUpdate,
  getAdminUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from '@/features/admin/api/news.api';
import { FormModal, type FieldConfig } from '@/shared/components/modals/FormModal';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { extractArray, getErrorMessage } from '@/shared/utils/apiUtils';

export default function NewsManagementPage() {
  const [updates, setUpdates] = useState<NewsUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUpdate, setEditingUpdate] = useState<NewsUpdate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadUpdates = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminUpdates();
      setUpdates(extractArray<NewsUpdate>(response));
    } catch (error) {
      console.error(error);
      notificationService.error('Failed to load news/updates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUpdates();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    try {
      await deleteUpdate(id);
      notificationService.success('Update deleted successfully');
      loadUpdates();
    } catch {
      notificationService.error('Failed to delete update');
    }
  }, []);

  const handleEdit = useCallback((update: NewsUpdate) => {
    setEditingUpdate(update);
    setShowModal(true);
  }, []);

  // Filter updates by status
  const filteredUpdates =
    statusFilter === 'ALL' ? updates : updates.filter((u) => u.status === statusFilter);

  // Count drafts for badge
  const draftCount = updates.filter((u) => u.status === 'DRAFT').length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-wiria-blue-dark">News & Updates Management</h2>
        <Button
          onClick={() => {
            setEditingUpdate(null);
            setShowModal(true);
          }}
        >
          + Post New Update
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`rounded-lg px-4 py-2 font-semibold transition-colors ${statusFilter === 'ALL' ? 'bg-wiria-blue-dark text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All ({updates.length})
        </button>
        <button
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`rounded-lg px-4 py-2 font-semibold transition-colors ${statusFilter === 'PUBLISHED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Published ({updates.filter((u) => u.status === 'PUBLISHED').length})
        </button>
        <button
          onClick={() => setStatusFilter('DRAFT')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${statusFilter === 'DRAFT' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Drafts
          {draftCount > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusFilter === 'DRAFT' ? 'bg-white text-yellow-600' : 'bg-yellow-100 text-yellow-700'}`}
            >
              {draftCount}
            </span>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUpdates && Array.isArray(filteredUpdates) ? (
            filteredUpdates.map((update) => (
              <NewsCard
                key={update.id}
                update={update}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-red-500">
              Error: Updates data is corrupted. Please refresh.
            </div>
          )}
          {filteredUpdates.length === 0 && (
            <p className="col-span-full py-12 text-center text-gray-500">
              {statusFilter === 'DRAFT'
                ? 'No draft updates. Create one by saving as Draft!'
                : 'No updates found.'}
            </p>
          )}
        </div>
      )}

      {showModal && (
        <NewsModal
          update={editingUpdate}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadUpdates();
          }}
        />
      )}
    </div>
  );
}

const NewsCard = memo(function NewsCard({
  update,
  onEdit,
  onDelete,
}: {
  update: NewsUpdate;
  onEdit: (update: NewsUpdate) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border-t-4 border-wiria-yellow bg-white shadow-lg">
      {update.imageUrl ? (
        <img src={update.imageUrl} alt={update.title} className="h-32 w-full object-cover" />
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}
      <div className="flex-grow p-5">
        <div className="mb-2 flex items-start justify-between">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
            {update.category}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(update.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-wiria-blue-dark">{update.title}</h3>
        <p className="line-clamp-3 text-sm text-gray-600">
          {update.excerpt ||
            (update.fullContent
              ? update.fullContent.slice(0, 150) + '...'
              : 'No content available')}
        </p>
        <div className="mt-2">
          <span
            className={`rounded px-2 py-1 text-xs font-bold ${update.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
          >
            {update.status}
          </span>
        </div>
      </div>
      <div className="mt-auto flex justify-end gap-3 border-t bg-gray-50 p-4">
        <button onClick={() => onEdit(update)} className="text-sm font-bold text-wiria-blue-dark hover:underline">
          Edit
        </button>
        <button onClick={() => onDelete(update.id)} className="text-sm font-bold text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
});

function NewsModal({
  update,
  onClose,
  onSuccess,
}: {
  update: NewsUpdate | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const payload = {
        title: data['title'] as string,
        imageUrl: data['imageUrl'] as string | undefined,
        category: data['category'] as string,
        status: data['status'] as string,
        fullContent: data['fullContent'] as string,
        excerpt: data['excerpt'] as string | undefined,
      };
      if (update) {
        await updateUpdate(update.id, payload);
        notificationService.success('Update modified successfully');
      } else {
        await createUpdate(payload);
        notificationService.success('Update created successfully');
      }
      onSuccess();
    } catch (error: unknown) {
      notificationService.error(getErrorMessage(error, 'Operation failed'));
      throw error;
    }
  };

  const fields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'e.g. New Community Program Launch'
    },
    {
      name: 'imageUrl',
      label: 'Image URL (Optional)',
      type: 'text',
      placeholder: 'https://...'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'GENERAL', label: 'General' },
        { value: 'EVENT', label: 'Event' },
        { value: 'ANNOUNCEMENT', label: 'Announcement' },
        { value: 'STORY', label: 'Success Story' },
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'PUBLISHED', label: 'Published' },
        { value: 'DRAFT', label: 'Draft' },
      ]
    },
    {
      name: 'fullContent',
      label: 'Content',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the update in detail...',
      rows: 8
    },
    {
      name: 'excerpt',
      label: 'Excerpt (Optional)',
      type: 'textarea',
      placeholder: 'Short summary...',
      rows: 3
    },
  ];

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={update ? 'Edit Update' : 'Post New Update'}
      fields={fields}
      initialData={update ? { ...update } : undefined}
      submitLabel="Save Post"
    />
  );
}
