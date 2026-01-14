import { Contact } from '@/features/admin/api/contacts.api';
import { Button } from '@/shared/components/ui/Button';

interface ReplyModalProps {
  contact: Contact;
  replyText: string;
  isSubmitting: boolean;
  setReplyText: (value: string) => void;
  onReply: () => void;
  onCancel: () => void;
}

export function ReplyModal({
  contact,
  replyText,
  isSubmitting,
  setReplyText,
  onReply,
  onCancel,
}: ReplyModalProps) {
  const MIN_REPLY_LENGTH = 10;
  const MAX_REPLY_LENGTH = 1000;
  const isReplyValid =
    replyText.trim().length >= MIN_REPLY_LENGTH && replyText.length <= MAX_REPLY_LENGTH;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="border-b p-6">
          <h3 className="text-xl font-bold">Reply to {contact.name}</h3>
          <p className="mt-1 truncate text-sm text-gray-500">Re: {contact.subject}</p>
        </div>
        <div className="p-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">Your Response *</label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className={`h-40 w-full rounded-xl border p-4 outline-none transition-all focus:ring-2 ${
              replyText.trim().length > 0 && !isReplyValid
                ? 'border-red-300 focus:ring-red-100'
                : 'border-gray-200 focus:ring-wiria-blue-dark/10'
            }`}
            placeholder="Type your reply here... This will be sent as an email response."
            maxLength={MAX_REPLY_LENGTH}
            required
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider">
              {replyText.trim().length > 0 && replyText.trim().length < MIN_REPLY_LENGTH && (
                <span className="text-red-500">Min {MIN_REPLY_LENGTH} chars required</span>
              )}
              {isReplyValid && <span className="text-green-600">✓ Valid response</span>}
            </div>
            <span
              className={`text-[10px] font-bold ${replyText.length > MAX_REPLY_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}
            >
              {replyText.length} / {MAX_REPLY_LENGTH}
            </span>
          </div>
        </div>
        <div className="flex gap-3 border-t p-6">
          <Button onClick={onReply} disabled={isSubmitting || !isReplyValid} className="flex-1">
            {isSubmitting ? 'Sending Email...' : 'Send Reply'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
