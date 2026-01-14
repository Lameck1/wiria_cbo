import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Resource,
  getAdminResources,
  deleteResource,
} from '@/features/admin/api/resources.api';
import { ResourceModal } from '@/features/admin/components/resources/ResourceModal';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { extractArray } from '@/shared/utils/apiUtils';

export default function ResourceManagementPage() {
  const queryClient = useQueryClient();
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['admin', 'resources'],
    queryFn: async () => {
      const response = await getAdminResources();
      return extractArray<Resource>(response);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      notificationService.success('Resource deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'resources'] });
    },
    onError: () => {
      notificationService.error('Failed to delete resource');
    },
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-wiria-blue-dark">Resource Management</h2>
        <Button
          onClick={() => {
            setEditingResource(null);
            setShowModal(true);
          }}
        >
          + Add New Resource
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-wiria-blue-dark"></div>
            Loading resources...
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="border-b bg-gray-50 text-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Public</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Downloads</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{resource.title}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase text-blue-700">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {resource.fileType} ({resource.fileSize})
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${resource.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {resource.isPublic ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{resource.downloads || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingResource(resource);
                        setShowModal(true);
                      }}
                      className="mr-4 text-sm font-bold text-wiria-blue-dark hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void handleDelete(resource.id)}
                      className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="mb-2 text-4xl opacity-20">📁</div>
                    No resources available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <ResourceModal
          resource={editingResource}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
