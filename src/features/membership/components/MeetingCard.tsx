import { memo } from 'react';

import type { Meeting } from '@/features/membership/hooks/useMemberData';
import { Button } from '@/shared/components/ui/Button';

const getMeetingTypeStyles = (type: string) => {
  switch (type) {
    case 'AGM': {
      return 'bg-purple-100 text-purple-800';
    }
    case 'SPECIAL': {
      return 'bg-red-100 text-red-800';
    }
    case 'TRAINING': {
      return 'bg-green-100 text-green-800';
    }
    default: {
      return 'bg-blue-100 text-blue-800';
    }
  }
};

const getMeetingStatusStyles = (status: string) => {
  switch (status) {
    case 'UPCOMING': {
      return 'bg-blue-50 text-blue-700';
    }
    case 'ONGOING': {
      return 'bg-green-50 text-green-700';
    }
    case 'COMPLETED': {
      return 'bg-gray-50 text-gray-600';
    }
    default: {
      return 'bg-red-50 text-red-700';
    }
  }
};

interface MeetingCardProps {
  meeting: Meeting;
  showRsvpButton?: boolean;
  loadingMeetingId: string | null;
  onRsvp: (id: string) => void;
  onCancelRsvp: (id: string) => void;
}

export const MeetingCard = memo(function MeetingCard({
  meeting,
  showRsvpButton = true,
  loadingMeetingId,
  onRsvp,
  onCancelRsvp,
}: MeetingCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span
              className={`rounded px-2 py-1 text-xs font-bold uppercase ${getMeetingTypeStyles(meeting.type)}`}
            >
              {meeting.type}
            </span>
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${getMeetingStatusStyles(meeting.status)}`}
            >
              {meeting.status}
            </span>
          </div>
          <h3 className="mb-2 text-lg font-bold text-wiria-blue-dark">{meeting.title}</h3>
          {meeting.description && (
            <p className="mb-3 text-sm text-gray-600">{meeting.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{new Date(meeting.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>{meeting.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{meeting.location}</span>
            </div>
            {meeting.attendeesCount !== undefined && (
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>
                  {meeting.attendeesCount}
                  {meeting.capacity ? ` / ${meeting.capacity}` : ''} attending
                </span>
              </div>
            )}
          </div>
        </div>
        {showRsvpButton && meeting.status === 'UPCOMING' && (
          <div className="flex-shrink-0">
            {meeting.isRsvpd ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelRsvp(meeting.id)}
                isLoading={loadingMeetingId === meeting.id}
              >
                Cancel RSVP
              </Button>
            ) : (
              <Button
                variant={
                  meeting.capacity && (meeting.attendeesCount ?? 0) >= meeting.capacity
                    ? 'outline'
                    : 'primary'
                }
                size="sm"
                onClick={() => onRsvp(meeting.id)}
                isLoading={loadingMeetingId === meeting.id}
                disabled={
                  meeting.capacity ? (meeting.attendeesCount ?? 0) >= meeting.capacity : false
                }
              >
                {meeting.capacity && (meeting.attendeesCount ?? 0) >= meeting.capacity
                  ? 'Fully Booked'
                  : 'RSVP Now'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
