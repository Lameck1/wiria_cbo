/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminMember, approveMember, rejectMember } from '@/features/membership/api/members.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { GroupCountHistory } from './GroupCountHistory';

interface MemberDetailsModalProps {
    member: AdminMember | null;
    onClose: () => void;
    onStatusChange: () => void;
}

export function MemberDetailsModal({ member, onClose, onStatusChange }: MemberDetailsModalProps) {
    if (!member) return null;

    const handleApprove = async () => {
        if (!confirm(`Approve membership for ${member.firstName} ${member.lastName}?`)) return;
        try {
            await approveMember(member.id);
            notificationService.success(`${member.firstName} has been approved!`);
            onStatusChange();
            onClose();
        } catch (error: any) {
            notificationService.error(error.userMessage || 'Failed to approve member');
        }
    };

    const handleReject = async () => {
        const reason = prompt(`Reject ${member.firstName}? Please provide a reason:`);
        if (!reason) return;

        try {
            await rejectMember(member.id, reason);
            notificationService.success('Application rejected');
            onStatusChange();
            onClose();
        } catch (error: any) {
            notificationService.error(error.userMessage || 'Failed to reject member');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-8 pb-4 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Member Application Review</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>

                <div className="p-8 pt-4 overflow-y-auto flex-1">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Personal Info */}
                        <div className="space-y-6">
                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Full Name" value={`${member.firstName} ${member.lastName}`} />
                                    <InfoItem label="Gender" value={member.gender || 'Not specified'} />
                                    <InfoItem label="National ID" value={member.nationalId || 'Not provided'} />
                                    <InfoItem label="Date of Birth" value={member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'Not provided'} />
                                </div>
                            </section>

                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</h4>
                                <div className="space-y-3">
                                    <InfoItem label="Email Address" value={member.email} />
                                    <InfoItem label="Phone Number" value={member.phone} />
                                    <InfoItem label="Address / Location" value={`${member.address || ''} ${member.ward ? ', ' + member.ward : ''}`} />
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Professional & Membership */}
                        <div className="space-y-6">
                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Professional Background</h4>
                                <InfoItem label="Occupation" value={member.occupation || 'Not specified'} />
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500">Skills</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {member.skills?.length ? (
                                            member.skills.map((skill: string) => (
                                                <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{skill}</span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">None listed</span>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.interests?.length ? (
                                        member.interests.map((interest: string) => (
                                            <span key={interest} className="bg-wiria-yellow bg-opacity-20 text-wiria-blue-dark px-2 py-1 rounded text-xs font-semibold">{interest}</span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">None listed</span>
                                    )}
                                </div>
                            </section>

                            <section className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
                                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">Membership Context</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Type" value={member.membershipType} />
                                    {member.membershipType === 'GROUP' && (
                                        <>
                                            <InfoItem label="Group Name" value={member.groupName || 'N/A'} />
                                            <InfoItem label="Current Count" value={member.currentMemberCount?.toString() || '0'} />
                                            <InfoItem label="Max Members Reached" value={member.maxMemberCountReached?.toString() || '0'} />

                                            <div className="col-span-2 mt-4">
                                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Group Size History</h5>
                                                <GroupCountHistory memberId={member.id} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>

                            <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-xs font-bold text-wiria-blue-dark uppercase tracking-wider mb-2">Member Status</h4>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Current Status</p>
                                        <div className="mt-1 font-bold">{member.status}</div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase">Member Number</p>
                                        <p className="font-mono font-bold text-wiria-blue-dark">{member.memberNumber}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t flex flex-wrap gap-4 items-center">
                        {member.status === 'PENDING' ? (
                            <>
                                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 flex-1">
                                    ✓ Approve Membership
                                </Button>
                                <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700 flex-1">
                                    ✗ Reject Application
                                </Button>
                            </>
                        ) : (
                            <div className="flex-1 text-center py-3 bg-gray-100 rounded-xl text-gray-600 font-bold">
                                Resolution: {member.status} (Processed on {new Date(member.updatedAt).toLocaleDateString()})
                            </div>
                        )}
                        <Button variant="outline" onClick={onClose} className="flex-grow md:flex-none">
                            Close Review
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}
