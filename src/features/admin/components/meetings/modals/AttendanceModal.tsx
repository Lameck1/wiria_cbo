import type { Meeting, MeetingAttendance } from '@/features/admin/api/meetings.api';
import { Button } from '@/shared/components/ui/Button';

interface AttendanceModalProps {
  meeting: Meeting;
  attendance: MeetingAttendance[];
  onClose: () => void;
}

export function AttendanceModal({ meeting, attendance, onClose }: AttendanceModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h3 className="text-xl font-bold">Meeting Attendance</h3>
            <p className="text-sm text-gray-500">{meeting.title}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-6">
          {attendance.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No attendance records.</p>
          ) : (
            <ul className="divide-y">
              {attendance.map((record) => (
                <li key={record.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">
                      {record.member?.firstName} {record.member?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{record.member?.email}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(record.checkedInAt).toLocaleTimeString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t p-6">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
