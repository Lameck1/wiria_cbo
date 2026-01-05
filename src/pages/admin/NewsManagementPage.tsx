import { useEffect, useState } from 'react';
import { NewsUpdate, getAdminUpdates, createUpdate, updateUpdate, deleteUpdate } from '@/features/admin/api/news.api';
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
    const filteredUpdates = statusFilter === 'ALL'
        ? updates
        : updates.filter(u => u.status === statusFilter);

    // Count drafts for badge
    const draftCount = updates.filter(u => u.status === 'DRAFT').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-wiria-blue-dark">News & Updates Management</h2>
                <Button onClick={() => { setEditingUpdate(null); setShowModal(true); }}>
                    + Post New Update
                </Button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === 'ALL' ? 'bg-wiria-blue-dark text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    All ({updates.length})
                </button>
                <button
                    onClick={() => setStatusFilter('PUBLISHED')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === 'PUBLISHED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Published ({updates.filter(u => u.status === 'PUBLISHED').length})
                </button>
                <button
                    onClick={() => setStatusFilter('DRAFT')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${statusFilter === 'DRAFT' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Drafts
                    {draftCount > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusFilter === 'DRAFT' ? 'bg-white text-yellow-600' : 'bg-yellow-100 text-yellow-700'}`}>
                            {draftCount}
                        </span>
                    )}
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUpdates && Array.isArray(filteredUpdates) ? filteredUpdates.map(update => (
                        <NewsCard
                            key={update.id}
                            update={update}
                            onEdit={() => { setEditingUpdate(update); setShowModal(true); }}
                            onDelete={() => handleDelete(update.id)}
                        />
                    )) : (
                        <div className="col-span-full text-red-500">Error: Updates data is corrupted. Please refresh.</div>
                    )}
                    {filteredUpdates.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 py-12">
                            {statusFilter === 'DRAFT' ? 'No draft updates. Create one by saving as Draft!' : 'No updates found.'}
                        </p>
                    )}
                </div>
            )}

            {showModal && (
                <NewsModal
                    update={editingUpdate}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); loadUpdates(); }}
                />
            )}
        </div>
    );
}

function NewsCard({ update, onEdit, onDelete }: { update: NewsUpdate; onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-wiria-yellow overflow-hidden flex flex-col h-full">
            {update.imageUrl ? (
                <img src={update.imageUrl} alt={update.title} className="w-full h-32 object-cover" />
            ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{update.category}</span>
                    <span className="text-gray-400 text-xs">{new Date(update.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-wiria-blue-dark line-clamp-2">{update.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                    {update.excerpt || (update.fullContent ? update.fullContent.substring(0, 150) + '...' : 'No content available')}
                </p>
                <div className="mt-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${update.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {update.status}
                    </span>
                </div>
            </div>
            <div className="bg-gray-50 p-4 border-t flex justify-end gap-3 mt-auto">
                <button onClick={onEdit} className="text-wiria-blue-dark hover:underline text-sm font-bold">Edit</button>
                <button onClick={onDelete} className="text-red-600 hover:underline text-sm font-bold">Delete</button>
            </div>
        </div>
    );
}

function NewsModal({ update, onClose, onSuccess }: { update: NewsUpdate | null; onClose: () => void; onSuccess: () => void }) {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h3 className="text-2xl font-bold">{update ? 'Edit Update' : 'Post New Update'}</h3>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="news-form" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="news-title">Title</label>
                            <input id="news-title" name="title" defaultValue={update?.title} className="w-full border rounded-lg p-3" required placeholder="e.g. New Community Program Launch" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="news-imageUrl">Image URL (Optional)</label>
                            <input id="news-imageUrl" name="imageUrl" defaultValue={update?.imageUrl} className="w-full border rounded-lg p-3" placeholder="https://..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="news-category">Category</label>
                                <select id="news-category" name="category" defaultValue={update?.category || 'GENERAL'} className="w-full border rounded-lg p-3">
                                    <option value="GENERAL">General</option>
                                    <option value="EVENT">Event</option>
                                    <option value="ANNOUNCEMENT">Announcement</option>
                                    <option value="STORY">Success Story</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="news-status">Status</label>
                                <select id="news-status" name="status" defaultValue={update?.status || 'PUBLISHED'} className="w-full border rounded-lg p-3">
                                    <option value="PUBLISHED">Published</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" htmlFor="news-fullContent">Content</label>
                            <textarea id="news-fullContent" name="fullContent" defaultValue={update?.fullContent} className="w-full border rounded-lg p-3 h-48" required placeholder="Describe the update in detail..." />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="news-excerpt">Excerpt (Optional)</label>
                            <textarea id="news-excerpt" name="excerpt" defaultValue={update?.excerpt} className="w-full border rounded-lg p-3 h-20" placeholder="Short summary..." />
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" fullWidth>Save Post</Button>
                            <Button type="button" variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
