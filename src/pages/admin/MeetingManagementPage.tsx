/**
 * Meeting Management Page
 * Admin view for managing meetings
 */

import { useEffect, useState } from 'react';
import {
    getMeetings,
    createMeeting,
    updateMeeting,
    cancelMeeting,
    getMeetingAttendance,
    Meeting,
    MeetingAttendance,
    CreateMeetingData,
} from '@/features/admin/api/meetings.api';
import { Button } from '@/shared/components/ui/Button';
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
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [attendance, setAttendance] = useState<MeetingAttendance[]>([]);
    const [showAttendance, setShowAttendance] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getMeetings();
            setMeetings(data);
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load meetings');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this meeting?')) return;
        try {
            await cancelMeeting(id);
            notificationService.success('Meeting cancelled');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to cancel meeting');
        }
    };

    const handleViewAttendance = async (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        try {
            const data = await getMeetingAttendance(meeting.id);
            setAttendance(data);
            setShowAttendance(true);
        } catch (_error) {
            notificationService.error('Failed to load attendance');
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-KE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours || '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes || '00'} ${ampm}`;
    };

    const upcomingMeetings = meetings.filter(m => m.status === 'SCHEDULED' && new Date(m.date) >= new Date());
    const pastMeetings = meetings.filter(m => m.status === 'COMPLETED' || new Date(m.date) < new Date());

    return (
        <div>
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-wiria-blue-dark mb-2">Meeting Management</h2>
                    <p className="text-gray-600">Schedule and manage organization meetings.</p>
                </div>
                <Button onClick={() => { setEditingMeeting(null); setShowModal(true); }}>+ Schedule Meeting</Button>
            </div>

            {/* Upcoming Meetings */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Upcoming Meetings</h3>
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center">Loading...</div>
                ) : upcomingMeetings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No upcoming meetings scheduled.</div>
                ) : (
                    <div className="grid gap-4">
                        {upcomingMeetings.map((meeting) => (
                            <div key={meeting.id} className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg text-wiria-blue-dark">{meeting.title}</h4>
                                        <p className="text-sm text-gray-500">{TYPE_LABELS[meeting.meetingType]}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[meeting.status]}`}>
                                        {meeting.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Date</p>
                                        <p className="font-semibold">{formatDate(meeting.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Time</p>
                                        <p className="font-semibold">{meeting.startTime && meeting.endTime ? `${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}` : 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Location</p>
                                        <p className="font-semibold">{meeting.isVirtual ? 'Virtual' : meeting.location}</p>
                                    </div>
                                    {meeting.virtualLink && (
                                        <div>
                                            <p className="text-gray-500">Virtual Link</p>
                                            <a href={meeting.virtualLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                                                Join Meeting
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => { setEditingMeeting(meeting); setShowModal(true); }}
                                        className="text-wiria-blue-dark hover:underline text-sm font-bold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleCancel(meeting.id)}
                                        className="text-red-600 hover:underline text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Meetings */}
            <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Past Meetings</h3>
                {pastMeetings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No past meetings.</div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4">Meeting</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Attendance</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pastMeetings.map((meeting) => (
                                    <tr key={meeting.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">{meeting.title}</td>
                                        <td className="px-6 py-4 text-sm">{TYPE_LABELS[meeting.meetingType]}</td>
                                        <td className="px-6 py-4 text-sm">{formatDate(meeting.date)}</td>
                                        <td className="px-6 py-4 text-sm">{meeting.attendanceCount || 0} members</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[meeting.status]}`}>
                                                {meeting.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewAttendance(meeting)}
                                                className="text-wiria-blue-dark hover:underline text-sm font-bold"
                                            >
                                                View Attendance
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Meeting Form Modal */}
            {showModal && (
                <MeetingFormModal
                    meeting={editingMeeting}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); loadData(); }}
                />
            )}

            {/* Attendance Modal */}
            {showAttendance && selectedMeeting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Meeting Attendance</h3>
                                <p className="text-sm text-gray-500">{selectedMeeting.title}</p>
                            </div>
                            <button onClick={() => setShowAttendance(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-6 max-h-96 overflow-y-auto">
                            {attendance.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No attendance records.</p>
                            ) : (
                                <ul className="divide-y">
                                    {attendance.map((record) => (
                                        <li key={record.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{record.member?.firstName} {record.member?.lastName}</p>
                                                <p className="text-xs text-gray-500">{record.member?.email}</p>
                                            </div>
                                            <p className="text-xs text-gray-400">{new Date(record.checkedInAt).toLocaleTimeString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="p-6 border-t">
                            <Button variant="secondary" fullWidth onClick={() => setShowAttendance(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MeetingFormModal({
    meeting,
    onClose,
    onSuccess,
}: {
    meeting: Meeting | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVirtual, setIsVirtual] = useState(meeting?.isVirtual || false);

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
            virtualLink: isVirtual ? formData.get('virtualLink') as string : undefined,
            agenda: formData.get('agenda') as string,
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
        } catch (_error) {
            notificationService.error('Failed to save meeting');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold">{meeting ? 'Edit Meeting' : 'Schedule New Meeting'}</h3>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="meetingTitle" className="block text-sm font-bold mb-2">Meeting Title *</label>
                            <input id="meetingTitle" name="title" defaultValue={meeting?.title} className="w-full border rounded-lg p-3" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="meetingType" className="block text-sm font-bold mb-2">Meeting Type *</label>
                                <select id="meetingType" name="meetingType" defaultValue={meeting?.meetingType} className="w-full border rounded-lg p-3" required>
                                    <option value="">Select type...</option>
                                    <option value="AGM">Annual General Meeting</option>
                                    <option value="SGM">Special General Meeting</option>
                                    <option value="COMMITTEE">Committee Meeting</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="meetingDate" className="block text-sm font-bold mb-2">Date *</label>
                                <input id="meetingDate" type="date" name="date" defaultValue={meeting?.date?.split('T')[0]} className="w-full border rounded-lg p-3" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="meetingStartTime" className="block text-sm font-bold mb-2">Start Time *</label>
                                <input id="meetingStartTime" type="time" name="startTime" defaultValue={meeting?.startTime} className="w-full border rounded-lg p-3" required />
                            </div>
                            <div>
                                <label htmlFor="meetingEndTime" className="block text-sm font-bold mb-2">End Time *</label>
                                <input id="meetingEndTime" type="time" name="endTime" defaultValue={meeting?.endTime} className="w-full border rounded-lg p-3" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="meetingLocation" className="block text-sm font-bold mb-2">Location *</label>
                            <input id="meetingLocation" name="location" defaultValue={meeting?.location} className="w-full border rounded-lg p-3" placeholder="e.g. WIRIA CBO Office, Nairobi" required />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="isVirtual" checked={isVirtual} onChange={(e) => setIsVirtual(e.target.checked)} />
                            <label htmlFor="isVirtual" className="font-semibold">This is a virtual/hybrid meeting</label>
                        </div>
                        {isVirtual && (
                            <div>
                                <label htmlFor="meetingVirtualLink" className="block text-sm font-bold mb-2">Virtual Meeting Link</label>
                                <input id="meetingVirtualLink" name="virtualLink" defaultValue={meeting?.virtualLink} className="w-full border rounded-lg p-3" placeholder="https://zoom.us/..." />
                            </div>
                        )}
                        <div>
                            <label htmlFor="meetingDescription" className="block text-sm font-bold mb-2">Description</label>
                            <textarea id="meetingDescription" name="description" defaultValue={meeting?.description} className="w-full border rounded-lg p-3 h-20" />
                        </div>
                        <div>
                            <label htmlFor="meetingAgenda" className="block text-sm font-bold mb-2">Agenda</label>
                            <textarea id="meetingAgenda" name="agenda" defaultValue={meeting?.agenda} className="w-full border rounded-lg p-3 h-24" placeholder="Meeting agenda items..." />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" fullWidth disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (meeting ? 'Update Meeting' : 'Schedule Meeting')}
                            </Button>
                            <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
