import { useEffect, useState } from 'react';
import { AdminUser, UserInvitation, getUsers, getInvitations, updateUserStatus, cancelInvitation, inviteUser } from '@/features/admin/api/users.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { UserRole } from '@/shared/types';
import { extractArray } from '@/shared/utils/apiUtils';

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [invitations, setInvitations] = useState<UserInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'ACTIVE') {
                const data = await getUsers();
                setUsers(extractArray<AdminUser>(data));
            } else {
                const data = await getInvitations();
                setInvitations(extractArray<UserInvitation>(data));
            }
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleStatusChange = async (email: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            await updateUserStatus(email, newStatus);
            notificationService.success('User status updated');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to update status');
        }
    };

    const handleCancelInvite = async (id: string) => {
        if (!confirm('Cancel this invitation?')) return;
        try {
            await cancelInvitation(id);
            notificationService.success('Invitation cancelled');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to cancel invitation');
        }
    };

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-wiria-blue-dark">Staff & Admin Management</h1>
                    <p className="text-gray-600 mt-1">Manage staff accounts, roles, and permissions</p>
                </div>
                <Button onClick={() => setShowInviteModal(true)}>
                    <span className="mr-2">+</span> Invite New User
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'ACTIVE' ? 'border-wiria-blue-dark text-wiria-blue-dark' : 'border-transparent text-gray-600 hover:text-wiria-blue-dark'}`}
                    onClick={() => setActiveTab('ACTIVE')}
                >
                    Active Users
                </button>
                <button
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'PENDING' ? 'border-wiria-blue-dark text-wiria-blue-dark' : 'border-transparent text-gray-600 hover:text-wiria-blue-dark'}`}
                    onClick={() => setActiveTab('PENDING')}
                >
                    Pending Invitations
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : activeTab === 'ACTIVE' ? (
                    <UsersTable users={users} onStatusChange={handleStatusChange} />
                ) : (
                    <InvitationsTable invitations={invitations} onCancel={handleCancelInvite} />
                )}
            </div>

            {showInviteModal && (
                <InviteUserModal
                    onClose={() => setShowInviteModal(false)}
                    onSuccess={() => {
                        setShowInviteModal(false);
                        if (activeTab === 'PENDING') loadData();
                        else setActiveTab('PENDING');
                    }}
                />
            )}
        </div>
    );
}

function UsersTable({ users, onStatusChange }: { users: AdminUser[]; onStatusChange: (email: string, status: string) => void }) {
    if (users.length === 0) return <div className="p-8 text-center text-gray-500">No users found.</div>;

    const roleBadge = (role: string) => {
        const styles: Record<string, string> = {
            SUPER_ADMIN: 'bg-purple-100 text-purple-700',
            ADMIN: 'bg-blue-100 text-blue-700',
            STAFF: 'bg-green-100 text-green-700',
            VOLUNTEER: 'bg-orange-100 text-orange-700',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[role] || 'bg-gray-100'}`}>{role}</span>;
    };

    return (
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{roleBadge(user.role)}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                                <span className={`h-2 w-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                                {user.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => onStatusChange(user.email, user.status)}
                                className={`text-sm font-semibold hover:underline ${user.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'}`}
                            >
                                {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function InvitationsTable({ invitations, onCancel }: { invitations: UserInvitation[]; onCancel: (id: string) => void }) {
    if (invitations.length === 0) return <div className="p-8 text-center text-gray-500">No pending invitations.</div>;

    return (
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Invited By</th>
                    <th className="px-6 py-4">Expires</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {invitations.map(invite => (
                    <tr key={invite.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{invite.email}</td>
                        <td className="px-6 py-4">{invite.role}</td>
                        <td className="px-6 py-4">{invite.inviter?.email || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(invite.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => onCancel(invite.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                                Cancel
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function InviteUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error.message || 'Failed to send invitation';
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold">Invite New User</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="invite-email">Email *</label>
                            <input id="invite-email" name="email" type="email" required className="w-full border rounded-lg p-2" disabled={isLoading} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="invite-firstName">First Name</label>
                            <input id="invite-firstName" name="firstName" className="w-full border rounded-lg p-2" disabled={isLoading} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="invite-lastName">Last Name</label>
                            <input id="invite-lastName" name="lastName" className="w-full border rounded-lg p-2" disabled={isLoading} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="invite-role">Role *</label>
                            <select id="invite-role" name="role" required className="w-full border rounded-lg p-2" disabled={isLoading}>
                                <option value="">Select a role...</option>
                                <option value={UserRole.STAFF}>Staff</option>
                                <option value={UserRole.ADMIN}>Admin</option>
                                <option value={UserRole.VOLUNTEER}>Volunteer</option>
                                <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button type="submit" fullWidth disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Invitation'}
                        </Button>
                        <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
