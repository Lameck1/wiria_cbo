import { useState } from 'react';

import { inviteUser } from '@/features/admin/api/users.api';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { notificationService } from '@/shared/services/notification/notificationService';
import { UserRole } from '@/shared/types';
import { getErrorMessage } from '@/shared/utils/apiUtils';

interface InviteUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteUserModal({ onClose, onSuccess }: InviteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
    };

    try {
      await inviteUser(data);
      notificationService.success(`Invitation sent to ${data.email}`);
      onSuccess();
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to send invitation');
      if (message.includes('session is no longer valid')) {
        notificationService.error('Session expired: Please log out and back in.');
      } else {
        notificationService.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Invite New User" size="2xl">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6 p-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500"
              htmlFor="invite-email"
            >
              Email Address *
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              placeholder="e.g. staff@wiria.org"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none transition-all focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500"
              htmlFor="invite-firstName"
            >
              First Name
            </label>
            <input
              id="invite-firstName"
              name="firstName"
              placeholder="e.g. Jane"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none transition-all focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500"
              htmlFor="invite-lastName"
            >
              Last Name
            </label>
            <input
              id="invite-lastName"
              name="lastName"
              placeholder="e.g. Doe"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none transition-all focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20"
              disabled={isLoading}
            />
          </div>
          <div className="md:col-span-2">
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500"
              htmlFor="invite-role"
            >
              System Role *
            </label>
            <select
              id="invite-role"
              name="role"
              required
              className="w-full appearance-none rounded-xl border-gray-200 bg-gray-50 p-3 outline-none transition-all focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20"
              disabled={isLoading}
            >
              <option value="">Select a role...</option>
              <option value={UserRole.STAFF}>Staff Member</option>
              <option value={UserRole.ADMIN}>Administrator</option>
              <option value={UserRole.VOLUNTEER}>Volunteer Coordinator</option>
              <option value={UserRole.SUPER_ADMIN}>Super Administrator</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" fullWidth isLoading={isLoading} className="h-12 text-lg">
            Send Invitation
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
            className="h-12 text-lg"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
