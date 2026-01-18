import { useMemo, useState } from 'react';

import type { Meeting, MeetingAttendance } from '@/features/admin/api/meetings.api';
import {
  cancelMeeting,
  getMeetingAttendance,
  getMeetings,
} from '@/features/admin/api/meetings.api';
import { getMeetingColumns } from '@/features/admin/components/meetings/MeetingTableColumns';
import { AttendanceModal } from '@/features/admin/components/meetings/modals/AttendanceModal';
import { MeetingFormModal } from '@/features/admin/components/meetings/modals/MeetingFormModal';
import { UpcomingMeetingsList } from '@/features/admin/components/meetings/UpcomingMeetingsList';
import { ConfirmDialog } from '@/shared/components/modals/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useAdminAction, useAdminData } from '@/shared/hooks/useAdminData';
import { notificationService } from '@/shared/services/notification/notificationService';

export default function MeetingManagementPage() {
  const { items: meetings, isLoading } = useAdminData<Meeting>(['meetings'], getMeetings);
  const cancelAction = useAdminAction(
    (id: string) => cancelMeeting(id),
    [['meetings']],
    {
      onSuccess: () => {
        notificationService.success('Meeting cancelled');
      },
      onError: () => {
        notificationService.error('Failed to cancel meeting');
      },
    }
  );

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<MeetingAttendance[]>([]);
  const [showAttendance, setShowAttendance] = useState(false);
  const [meetingIdToCancel, setMeetingIdToCancel] = useState<string | null>(null);

  const selectedMeeting: Meeting | null = useMemo(
    () => meetings.find((meeting) => meeting.id === selectedMeetingId) ?? null,
    [meetings, selectedMeetingId]
  );

  const handleCancel = (id: string) => {
    setMeetingIdToCancel(id);
  };

  const handleConfirmCancel = () => {
    if (!meetingIdToCancel) return;
    cancelAction.mutate(meetingIdToCancel);
    setMeetingIdToCancel(null);
  };

  const handleViewAttendance = async (meeting: Meeting) => {
    setSelectedMeetingId(meeting.id);
    try {
      const data = await getMeetingAttendance(meeting.id);
      setAttendance(data);
      setShowAttendance(true);
    } catch {
      notificationService.error('Failed to load attendance');
    }
  };

  const upcomingMeetings = meetings.filter(
    (m) => m.status === 'SCHEDULED' && new Date(m.date) >= new Date()
  );
  const pastMeetings = meetings.filter(
    (m) => m.status === 'COMPLETED' || new Date(m.date) < new Date()
  );

  const columns = getMeetingColumns((m) => void handleViewAttendance(m));

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meeting Management</h1>
          <p className="mt-1 font-medium text-gray-500">
            Schedule and manage organization meetings.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingMeeting(null);
            setShowFormModal(true);
          }}
        >
          + Schedule Meeting
        </Button>
      </header>

      {/* Upcoming Meetings */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          Upcoming Meetings
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
            {upcomingMeetings.length}
          </span>
        </h3>
        <UpcomingMeetingsList
          meetings={upcomingMeetings}
          isLoading={isLoading}
          onEdit={(meeting) => {
            setEditingMeeting(meeting);
            setShowFormModal(true);
          }}
          onCancel={handleCancel}
        />
      </section>

      {/* Past Meetings */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          Past Meetings
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {pastMeetings.length}
          </span>
        </h3>
        <DataTable
          columns={columns}
          data={pastMeetings}
          rowKey="id"
          emptyMessage="No past meetings found."
        />
      </section>

      {showFormModal && (
        <MeetingFormModal
          meeting={editingMeeting}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => setShowFormModal(false)}
        />
      )}

      {showAttendance && selectedMeeting && (
        <AttendanceModal
          meeting={selectedMeeting}
          attendance={attendance}
          onClose={() => setShowAttendance(false)}
        />
      )}
      <ConfirmDialog
        isOpen={meetingIdToCancel !== null}
        title="Cancel Meeting"
        message="Are you sure you want to cancel this meeting?"
        confirmLabel="Cancel Meeting"
        onConfirm={handleConfirmCancel}
        onCancel={() => setMeetingIdToCancel(null)}
      />
    </div>
  );
}
