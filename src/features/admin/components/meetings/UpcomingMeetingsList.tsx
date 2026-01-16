import { Meeting } from '@/features/admin/api/meetings.api';

import { STATUS_COLORS, TYPE_LABELS, formatDate, formatTime } from './constants';

interface UpcomingMeetingsListProps {
  meetings: Meeting[];
  isLoading: boolean;
  onEdit: (meeting: Meeting) => void;
  onCancel: (id: string) => void;
}

export function UpcomingMeetingsList({
  meetings,
  isLoading,
  onEdit,
  onCancel,
}: UpcomingMeetingsListProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-12 text-center">
        Loading meetings...
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center italic text-gray-500">
        No upcoming meetings scheduled.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {meetings.map((meeting) => (
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
                onClick={() => onEdit(meeting)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-wiria-blue-dark/5 py-2 text-sm font-bold text-wiria-blue-dark transition-all hover:bg-wiria-blue-dark hover:text-white"
              >
                Edit Details
              </button>
              <button
                onClick={() => onCancel(meeting.id)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
              >
                Cancel Meeting
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
