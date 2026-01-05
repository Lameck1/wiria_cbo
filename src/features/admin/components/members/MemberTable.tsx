import { AdminMember } from '@/features/membership/api/members.api';
import { Button } from '@/shared/components/ui/Button';

interface MemberTableProps {
    members: AdminMember[];
    isLoading: boolean;
    onViewDetails: (member: AdminMember) => void;
}

export function MemberTable({ members = [], isLoading, onViewDetails }: MemberTableProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
                <p className="mt-4 text-gray-600">Loading members...</p>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center text-gray-500">
                <p className="text-lg font-semibold">No members found</p>
                <p className="text-sm mt-2">Try changing your filter or search criteria</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Member #</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                                    {member.memberNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {member.firstName} {member.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${member.membershipType === 'GROUP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {member.membershipType}
                                    </span>
                                    {member.membershipType === 'GROUP' && (
                                        <div className="text-[10px] text-gray-500 font-medium mt-1">{member.groupName}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div>{member.email}</div>
                                    <div className="text-xs">{member.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={member.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <PaymentInfo payments={member.payments} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(member.joinDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Button size="sm" onClick={() => onViewDetails(member)}>
                                        Review
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ACTIVE: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
        EXPIRED: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PaymentInfo({ payments }: { payments: any[] }) {
    if (!payments || payments.length === 0) {
        return <span className="text-gray-400 text-xs">No payments</span>;
    }

    const latest = payments[0];
    const statusColor =
        latest.status === 'COMPLETED' ? 'text-green-600' :
            latest.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600';

    return (
        <div>
            <div className="font-semibold text-gray-900">KES {latest.amount.toLocaleString()}</div>
            <div className={`text-xs ${statusColor}`}>{latest.status}</div>
        </div>
    );
}
