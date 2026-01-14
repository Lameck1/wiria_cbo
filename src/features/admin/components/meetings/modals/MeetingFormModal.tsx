import { useState } from 'react';

import {
  Meeting,
  CreateMeetingData,
  createMeeting,
  updateMeeting,
} from '@/features/admin/api/meetings.api';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { notificationService } from '@/shared/services/notification/notificationService';

interface MeetingFormModalProps {
  meeting: Meeting | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MeetingFormModal({ meeting, onClose, onSuccess }: MeetingFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVirtual, setIsVirtual] = useState(meeting?.isVirtual ?? false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const data: CreateMeetingData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      meetingType: formData.get('meetingType') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string,
      isVirtual,
      virtualLink: isVirtual ? (formData.get('virtualLink') as string) : undefined,
      agenda: formData.get('agenda') as string,
      capacity: formData.get('capacity') ? Number.parseInt(formData.get('capacity') as string) : undefined,
    };

    try {
      if (meeting) {
        await updateMeeting(meeting.id, data);
        notificationService.success('Meeting updated');
      } else {
        await createMeeting(data);
        notificationService.success('Meeting scheduled');
      }
      onSuccess();
    } catch {
      notificationService.error('Failed to save meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={meeting ? 'Edit Meeting' : 'Schedule New Meeting'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="meetingTitle" className="mb-2 block text-sm font-bold">
            Meeting Title *
          </label>
          <input
            id="meetingTitle"
            name="title"
            defaultValue={meeting?.title}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="meetingType" className="mb-2 block text-sm font-bold">
              Meeting Type *
            </label>
            <select
              id="meetingType"
              name="meetingType"
              defaultValue={meeting?.meetingType}
              className="w-full rounded-lg border p-3"
              required
            >
              <option value="">Select type...</option>
              <option value="AGM">Annual General Meeting</option>
              <option value="SGM">Special General Meeting</option>
              <option value="COMMITTEE">Committee Meeting</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="meetingDate" className="mb-2 block text-sm font-bold">
              Date *
            </label>
            <input
              id="meetingDate"
              type="date"
              name="date"
              defaultValue={meeting?.date?.split('T')[0]}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="meetingStartTime" className="mb-2 block text-sm font-bold">
              Start Time *
            </label>
            <input
              id="meetingStartTime"
              type="time"
              name="startTime"
              defaultValue={meeting?.startTime}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>
          <div>
            <label htmlFor="meetingEndTime" className="mb-2 block text-sm font-bold">
              End Time *
            </label>
            <input
              id="meetingEndTime"
              type="time"
              name="endTime"
              defaultValue={meeting?.endTime}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="meetingLocation" className="mb-2 block text-sm font-bold">
              Location *
            </label>
            <input
              id="meetingLocation"
              name="location"
              defaultValue={meeting?.location}
              className="w-full rounded-lg border p-3"
              placeholder="e.g. WIRIA CBO Office, Nairobi"
              required
            />
          </div>
          <div>
            <label htmlFor="meetingCapacity" className="mb-2 block text-sm font-bold">
              Capacity (Optional)
            </label>
            <input
              id="meetingCapacity"
              type="number"
              name="capacity"
              defaultValue={meeting?.capacity ?? ''}
              className="w-full rounded-lg border p-3"
              placeholder="e.g. 50"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVirtual"
            checked={isVirtual}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsVirtual(e.target.checked)}
          />
          <label htmlFor="isVirtual" className="cursor-pointer font-semibold">
            This is a virtual/hybrid meeting
          </label>
        </div>
        {isVirtual && (
          <div>
            <label htmlFor="meetingVirtualLink" className="mb-2 block text-sm font-bold">
              Virtual Meeting Link
            </label>
            <input
              id="meetingVirtualLink"
              name="virtualLink"
              defaultValue={meeting?.virtualLink}
              className="w-full rounded-lg border p-3"
              placeholder="https://zoom.us/..."
            />
          </div>
        )}
        <div>
          <label htmlFor="meetingDescription" className="mb-2 block text-sm font-bold">
            Description
          </label>
          <textarea
            id="meetingDescription"
            name="description"
            defaultValue={meeting?.description}
            className="h-20 w-full rounded-lg border p-3"
          />
        </div>
        <div>
          <label htmlFor="meetingAgenda" className="mb-2 block text-sm font-bold">
            Agenda
          </label>
          <textarea
            id="meetingAgenda"
            name="agenda"
            defaultValue={meeting?.agenda}
            className="h-24 w-full rounded-lg border p-3"
            placeholder="Meeting agenda items..."
          />
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : meeting ? 'Update Meeting' : 'Schedule Meeting'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
