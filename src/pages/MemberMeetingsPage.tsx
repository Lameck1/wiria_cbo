/**
 * Member Meetings Page
 * View and RSVP to meetings
 */

import { useEffect, useState } from 'react';

import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { Meeting, useMemberData } from '@/features/membership/hooks/useMemberData';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { notificationService } from '@/shared/services/notification/notificationService';

type Tab = 'my-meetings' | 'available-meetings';

const MY_MEETINGS_TAB: Tab = 'my-meetings';
const AVAILABLE_MEETINGS_TAB: Tab = 'available-meetings';

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

const MeetingCard = ({
  meeting,
  showRsvpButton = true,
  loadingMeetingId,
  onRsvp,
  onCancelRsvp
}: {
  meeting: Meeting;
  showRsvpButton?: boolean;
  loadingMeetingId: string | null;
  onRsvp: (id: string) => void;
  onCancelRsvp: (id: string) => void;
}) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-3">
          <span className={`rounded px-2 py-1 text-xs font-bold uppercase ${getMeetingTypeStyles(meeting.type)}`}>
            {meeting.type}
          </span>
          <span className={`rounded px-2 py-1 text-xs font-semibold ${getMeetingStatusStyles(meeting.status)}`}>
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
              variant={meeting.capacity && (meeting.attendeesCount ?? 0) >= meeting.capacity ? "outline" : "primary"}
              size="sm"
              onClick={() => onRsvp(meeting.id)}
              isLoading={loadingMeetingId === meeting.id}
              disabled={meeting.capacity ? (meeting.attendeesCount ?? 0) >= meeting.capacity : false}
            >
              {meeting.capacity && (meeting.attendeesCount ?? 0) >= meeting.capacity ? "Fully Booked" : "RSVP Now"}
            </Button>
          )}
        </div>
      )}
    </div>
  </div>
);

function MemberMeetingsPage() {
  const {
    meetings,
    availableMeetings,
    isLoading,
    fetchMeetings,
    fetchAvailableMeetings,
    rsvpToMeeting,
    cancelRsvp,
  } = useMemberData();

  const [activeTab, setActiveTab] = useState<Tab>(MY_MEETINGS_TAB);
  const [loadingMeetingId, setLoadingMeetingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchMeetings();
    void fetchAvailableMeetings();
  }, [fetchMeetings, fetchAvailableMeetings]);

  const handleRsvp = async (meetingId: string) => {
    setLoadingMeetingId(meetingId);
    try {
      await rsvpToMeeting(meetingId);
      notificationService.success("Successfully RSVP'd to meeting!");
    } catch {
      notificationService.error('Failed to RSVP. Please try again.');
    } finally {
      setLoadingMeetingId(null);
    }
  };

  const handleCancelRsvp = async (meetingId: string) => {
    setLoadingMeetingId(meetingId);
    try {
      await cancelRsvp(meetingId);
      notificationService.success('RSVP cancelled');
    } catch {
      notificationService.error('Failed to cancel RSVP. Please try again.');
    } finally {
      setLoadingMeetingId(null);
    }
  };

  const noMeetingsMessage =
    activeTab === MY_MEETINGS_TAB
      ? "You haven't RSVP'd to any meetings yet"
      : 'No available meetings at this time';

  const tabButtonBaseClass =
    'border-b-2 px-6 pb-4 pt-4 text-sm font-bold transition-colors';

  const currentMeetings =
    activeTab === MY_MEETINGS_TAB ? meetings : availableMeetings;

  if (isLoading && meetings.length === 0) {
    return (
      <PortalLayout title="Meetings & Events">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title="Meetings & Events"
      subtitle="View upcoming events, RSVP, and manage your schedule"
    >
      {/* Tabs */}
      <Card className="mb-0 rounded-b-none border-b-0">
        <CardBody className="px-0 py-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab(MY_MEETINGS_TAB);
              }}
              className={`${tabButtonBaseClass} ${
                activeTab === MY_MEETINGS_TAB
                ? 'border-wiria-blue-dark text-wiria-blue-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Meetings
              {meetings.length > 0 && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === MY_MEETINGS_TAB
                    ? 'bg-wiria-blue-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {meetings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab(AVAILABLE_MEETINGS_TAB);
              }}
              className={`${tabButtonBaseClass} ${
                activeTab === AVAILABLE_MEETINGS_TAB
                ? 'border-wiria-blue-dark text-wiria-blue-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Meetings
              {availableMeetings.length > 0 && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === AVAILABLE_MEETINGS_TAB
                    ? 'bg-wiria-blue-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {availableMeetings.length}
                </span>
              )}
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Content */}
      <Card className="rounded-t-none border-t-0">
        <CardBody className="min-h-[400px]">
          {currentMeetings.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📅</div>
              <p className="text-gray-500">
                {noMeetingsMessage}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  showRsvpButton={activeTab === 'available-meetings'}
                  loadingMeetingId={loadingMeetingId}
                  onRsvp={(meetingId) => {
                    void handleRsvp(meetingId);
                  }}
                  onCancelRsvp={(meetingId) => {
                    void handleCancelRsvp(meetingId);
                  }}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </PortalLayout>
  );
}

export default MemberMeetingsPage;
