/**
 * Member Meetings Page
 * View and RSVP to meetings
 */

import { useEffect, useState, useCallback } from 'react';

import { MeetingCard } from '@/features/membership/components/MeetingCard';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { notificationService } from '@/shared/services/notification/notificationService';

type Tab = 'my-meetings' | 'available-meetings';

const MY_MEETINGS_TAB: Tab = 'my-meetings';
const AVAILABLE_MEETINGS_TAB: Tab = 'available-meetings';

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

  const handleRsvp = useCallback(
    async (meetingId: string) => {
      setLoadingMeetingId(meetingId);
      try {
        await rsvpToMeeting(meetingId);
        notificationService.success("Successfully RSVP'd to meeting!");
      } catch {
        notificationService.error('Failed to RSVP. Please try again.');
      } finally {
        setLoadingMeetingId(null);
      }
    },
    [rsvpToMeeting]
  );

  const handleCancelRsvp = useCallback(
    async (meetingId: string) => {
      setLoadingMeetingId(meetingId);
      try {
        await cancelRsvp(meetingId);
        notificationService.success('RSVP cancelled');
      } catch {
        notificationService.error('Failed to cancel RSVP. Please try again.');
      } finally {
        setLoadingMeetingId(null);
      }
    },
    [cancelRsvp]
  );

  const noMeetingsMessage =
    activeTab === MY_MEETINGS_TAB
      ? "You haven't RSVP'd to any meetings yet"
      : 'No available meetings at this time';

  const tabButtonBaseClass = 'border-b-2 px-6 pb-4 pt-4 text-sm font-bold transition-colors';

  const currentMeetings = activeTab === MY_MEETINGS_TAB ? meetings : availableMeetings;

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
              <p className="text-gray-500">{noMeetingsMessage}</p>
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
