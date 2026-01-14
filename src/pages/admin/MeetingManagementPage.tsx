import { useState } from 'react';

import {
  getMeetings,
  cancelMeeting,
  getMeetingAttendance,
  Meeting,
  MeetingAttendance,
} from '@/features/admin/api/meetings.api';
import { AttendanceModal } from '@/features/admin/components/meetings/modals/AttendanceModal';
import { MeetingFormModal } from '@/features/admin/components/meetings/modals/MeetingFormModal';
import { Button } from '@/shared/components/ui/Button';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';
import { notificationService } from '@/shared/services/notification/notificationService';

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const TYPE_LABELS: Record<string, string> = {
  AGM: 'Annual General Meeting',
  SGM: 'Special General Meeting',
  COMMITTEE: 'Committee Meeting',
  OTHER: 'Other',
};

export default function MeetingManagementPage() {
  const { items: meetings, isLoading } = useAdminData<Meeting>(['meetings'], getMeetings);
  const cancelAction = useAdminAction((id: string) => cancelMeeting(id), [['meetings']], {
    successMessage: 'Meeting cancelled',
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [attendance, setAttendance] = useState<MeetingAttendance[]>([]);
  const [showAttendance, setShowAttendance] = useState(false);

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this meeting?')) {
      cancelAction.mutate(id);
    }
  };

  const handleViewAttendance = async (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    try {
      const data = await getMeetingAttendance(meeting.id);
      setAttendance(data);
      setShowAttendance(true);
    } catch {
      notificationService.error('Failed to load attendance');
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = Number.parseInt(hours || '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || '00'} ${ampm}`;
  };

  const upcomingMeetings = meetings.filter(
    (m) => m.status === 'SCHEDULED' && new Date(m.date) >= new Date()
  );
  const pastMeetings = meetings.filter(
    (m) => m.status === 'COMPLETED' || new Date(m.date) < new Date()
  );

  const columns: Column<Meeting>[] = [
    { header: 'Meeting', key: 'title', className: 'font-semibold' },
    {
      header: 'Type',
      key: 'meetingType',
      render: (m) => <span className="text-sm">{TYPE_LABELS[m.meetingType]}</span>,
    },
    {
      header: 'Date',
      key: 'date',
      render: (m) => <span className="text-sm">{formatDate(m.date)}</span>,
    },
    {
      header: 'Attendance',
      key: 'attendanceCount',
      render: (m) => <span className="text-sm">{m.attendanceCount || 0} members</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (m) => (
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${STATUS_COLORS[m.status]}`}>
          {m.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (m) => (
        <button
          onClick={() => handleViewAttendance(m)}
          className="text-sm font-bold text-wiria-blue-dark hover:underline"
        >
          View Attendance
        </button>
      ),
    },
  ];

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
        {isLoading ? (
          <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-12 text-center">
            Loading meetings...
          </div>
        ) : upcomingMeetings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center italic text-gray-500">
            No upcoming meetings scheduled.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500" />
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-wiria-blue-dark">
                      {meeting.title}
                    </h4>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                      {TYPE_LABELS[meeting.meetingType]}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${STATUS_COLORS[meeting.status]}`}
                  >
                    {meeting.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-100/50 bg-gray-50 p-4">
                    <p className="mb-1 text-xs font-bold uppercase text-gray-400">Date & Time</p>
                    <p className="font-bold text-gray-800">{formatDate(meeting.date)}</p>
                    <p className="text-sm font-medium text-gray-600">
                      {meeting.startTime && meeting.endTime
                        ? `${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}`
                        : 'TBD'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100/50 bg-gray-50 p-4">
                    <p className="mb-1 text-xs font-bold uppercase text-gray-400">Location</p>
                    <p className="flex items-center gap-2 font-bold text-gray-800">
                      {meeting.isVirtual ? (
                        <>
                          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />{' '}
                          Virtual
                        </>
                      ) : (
                        meeting.location
                      )}
                    </p>
                    {meeting.virtualLink && (
                      <a
                        href={meeting.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs font-bold text-blue-600 transition-colors hover:text-blue-800"
                      >
                        Join Meeting{' '}
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingMeeting(meeting);
                        setShowFormModal(true);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-wiria-blue-dark/5 py-2 text-sm font-bold text-wiria-blue-dark transition-all hover:bg-wiria-blue-dark hover:text-white"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleCancel(meeting.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                    >
                      Cancel Meeting
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
}
