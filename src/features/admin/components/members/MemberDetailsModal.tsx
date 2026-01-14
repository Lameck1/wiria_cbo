import { AdminMember, approveMember, rejectMember } from '@/features/membership/api/members.api';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { notificationService } from '@/shared/services/notification/notificationService';
import { getErrorMessage } from '@/shared/utils/apiUtils';

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
    } catch (error: unknown) {
      notificationService.error(getErrorMessage(error, 'Failed to approve member'));
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
    } catch (error: unknown) {
      notificationService.error(getErrorMessage(error, 'Failed to reject member'));
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Member Application Review" size="3xl">
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Personal Info */}
          <div className="space-y-6">
            <section>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Full Name" value={`${member.firstName} ${member.lastName}`} />
                <InfoItem label="Gender" value={member.gender || 'Not specified'} />
                <InfoItem label="National ID" value={member.nationalId || 'Not provided'} />
                <InfoItem
                  label="Date of Birth"
                  value={
                    member.dateOfBirth
                      ? new Date(member.dateOfBirth).toLocaleDateString()
                      : 'Not provided'
                  }
                />
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Contact Details
              </h4>
              <div className="space-y-3">
                <InfoItem label="Email Address" value={member.email} />
                <InfoItem label="Phone Number" value={member.phone} />
                <InfoItem
                  label="Address / Location"
                  value={`${member.address || ''} ${member.ward ? ', ' + member.ward : ''}`}
                />
              </div>
            </section>
          </div>

          {/* Right Column: Professional & Membership */}
          <div className="space-y-6">
            <section>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Professional Background
              </h4>
              <InfoItem label="Occupation" value={member.occupation || 'Not specified'} />
              <div className="mt-3">
                <p className="text-xs text-gray-500">Skills</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {member.skills?.length ? (
                    member.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">None listed</span>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.interests?.length ? (
                  member.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="rounded bg-wiria-yellow bg-opacity-20 px-2 py-1 text-xs font-semibold text-wiria-blue-dark"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None listed</span>
                )}
              </div>
            </section>

            <section className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-900">
                Membership Context
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Type" value={member.membershipType} />
                {member.membershipType === 'GROUP' && (
                  <>
                    <InfoItem label="Group Name" value={member.groupName || 'N/A'} />
                    <InfoItem
                      label="Current Count"
                      value={member.currentMemberCount?.toString() || '0'}
                    />
                    <InfoItem
                      label="Max Members Reached"
                      value={member.maxMemberCountReached?.toString() || '0'}
                    />

                    <div className="col-span-2 mt-4">
                      <h5 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Group Size History
                      </h5>
                      <GroupCountHistory memberId={member.id} />
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-wiria-blue-dark">
                Member Status
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-500">Current Status</p>
                  <div className="mt-1 font-bold">{member.status}</div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-gray-500">Member Number</p>
                  <p className="font-mono font-bold text-wiria-blue-dark">{member.memberNumber}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t pt-6">
          {member.status === 'PENDING' ? (
            <>
              <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                ✓ Approve Membership
              </Button>
              <Button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700">
                ✗ Reject Application
              </Button>
            </>
          ) : (
            <div className="flex-1 rounded-xl bg-gray-100 py-3 text-center font-bold text-gray-600">
              Resolution: {member.status} (Processed on{' '}
              {new Date(member.updatedAt).toLocaleDateString()})
            </div>
          )}
          <Button variant="outline" onClick={onClose} className="flex-grow md:flex-none">
            Close Review
          </Button>
        </div>
      </div>
    </Modal>
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
