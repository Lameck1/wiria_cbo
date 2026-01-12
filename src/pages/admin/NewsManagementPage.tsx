import { useEffect, useState } from 'react';
import {
  NewsUpdate,
  getAdminUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from '@/features/admin/api/news.api';
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
    loadUpdates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      await deleteUpdate(id);
      notificationService.success('Update deleted successfully');
      loadUpdates();
    } catch (_error) {
      notificationService.error('Failed to delete update');
    }
  };

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
                onEdit={() => {
                  setEditingUpdate(update);
                  setShowModal(true);
                }}
                onDelete={() => handleDelete(update.id)}
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

function NewsCard({
  update,
  onEdit,
  onDelete,
}: {
  update: NewsUpdate;
  onEdit: () => void;
  onDelete: () => void;
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
              ? update.fullContent.substring(0, 150) + '...'
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
        <button onClick={onEdit} className="text-sm font-bold text-wiria-blue-dark hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-sm font-bold text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}

function NewsModal({
  update,
  onClose,
  onSuccess,
}: {
  update: NewsUpdate | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      fullContent: formData.get('fullContent') as string,
      excerpt: formData.get('excerpt') as string,
    };

    try {
      if (update) {
        await updateUpdate(update.id, data);
        notificationService.success('Update modified successfully');
      } else {
        await createUpdate(data);
        notificationService.success('Update created successfully');
      }
      onSuccess();
    } catch (error: unknown) {
      notificationService.error(getErrorMessage(error, 'Operation failed'));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="border-b p-6">
          <h3 className="text-2xl font-bold">{update ? 'Edit Update' : 'Post New Update'}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <form id="news-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="news-title">
                Title
              </label>
              <input
                id="news-title"
                name="title"
                defaultValue={update?.title}
                className="w-full rounded-lg border p-3"
                required
                placeholder="e.g. New Community Program Launch"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="news-imageUrl">
                Image URL (Optional)
              </label>
              <input
                id="news-imageUrl"
                name="imageUrl"
                defaultValue={update?.imageUrl}
                className="w-full rounded-lg border p-3"
                placeholder="https://..."
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="news-category">
                  Category
                </label>
                <select
                  id="news-category"
                  name="category"
                  defaultValue={update?.category || 'GENERAL'}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="GENERAL">General</option>
                  <option value="EVENT">Event</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="STORY">Success Story</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="news-status">
                  Status
                </label>
                <select
                  id="news-status"
                  name="status"
                  defaultValue={update?.status || 'PUBLISHED'}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold" htmlFor="news-fullContent">
                Content
              </label>
              <textarea
                id="news-fullContent"
                name="fullContent"
                defaultValue={update?.fullContent}
                className="h-48 w-full rounded-lg border p-3"
                required
                placeholder="Describe the update in detail..."
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="news-excerpt">
                Excerpt (Optional)
              </label>
              <textarea
                id="news-excerpt"
                name="excerpt"
                defaultValue={update?.excerpt}
                className="h-20 w-full rounded-lg border p-3"
                placeholder="Short summary..."
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" fullWidth>
                Save Post
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
