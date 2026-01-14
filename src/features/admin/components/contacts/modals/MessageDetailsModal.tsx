import { Contact } from '@/features/admin/api/contacts.api';
import { Button } from '@/shared/components/ui/Button';

interface MessageDetailsModalProps {
  contact: Contact;
  onClose: () => void;
  onReply: () => void;
}

export function MessageDetailsModal({ contact, onClose, onReply }: MessageDetailsModalProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-xl font-bold">Message Details</h3>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoItem label="From" value={contact.name} />
            <InfoItem label="Email" value={contact.email} />
            <InfoItem label="Phone" value={contact.phone ?? 'N/A'} />
            <InfoItem label="Received" value={formatDate(contact.createdAt)} />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Subject
            </p>
            <p className="text-lg font-bold text-gray-900">{contact.subject}</p>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Message Content
            </p>
            <div className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-5 leading-relaxed text-gray-700">
              {contact.message}
            </div>
          </div>
          {contact.response && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-green-600">
                Internal Response
              </p>
              <div className="rounded-xl border border-green-100 bg-green-50 p-5 text-green-700">
                {contact.response}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 border-t p-6">
          {contact.status === 'NEW' && <Button onClick={onReply}>Reply Now</Button>}
          <Button variant="secondary" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
