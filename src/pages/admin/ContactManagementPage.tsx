/**
 * Contact Messages Management Page
 * Admin view for managing contact form submissions
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getContacts, respondToContact, archiveContact, Contact } from '@/features/admin/api/contacts.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';

const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-yellow-100 text-yellow-700',
    READ: 'bg-blue-100 text-blue-700',
    RESPONDED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-gray-100 text-gray-500',
};

export default function ContactManagementPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const highlightId = searchParams.get('highlight');

    const MIN_REPLY_LENGTH = 10;
    const MAX_REPLY_LENGTH = 1000;
    const isReplyValid = replyText.trim().length >= MIN_REPLY_LENGTH && replyText.length <= MAX_REPLY_LENGTH;

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getContacts(statusFilter ? { status: statusFilter } : undefined);
            setContacts(data);

            // Auto-open highlighted contact
            if (highlightId) {
                const target = data.find((c: Contact) => c.id === highlightId);
                if (target) {
                    setSelectedContact(target);
                    searchParams.delete('highlight');
                    setSearchParams(searchParams, { replace: true });
                }
            }
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const handleReply = async () => {
        if (!selectedContact || !replyText.trim()) return;
        setIsSubmitting(true);
        try {
            await respondToContact(selectedContact.id, replyText);
            notificationService.success('Reply sent successfully');
            setShowReplyModal(false);
            setReplyText('');
            setSelectedContact(null);
            loadData();
        } catch (_error) {
            notificationService.error('Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleArchive = async (id: string) => {
        if (!confirm('Are you sure you want to archive this message?')) return;
        try {
            await archiveContact(id);
            notificationService.success('Message archived');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to archive message');
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const pendingCount = contacts.filter(c => c.status === 'NEW').length;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-wiria-blue-dark mb-2">Contact Messages</h2>
                <p className="text-gray-600">Manage and respond to messages from the contact form.</p>
                {pendingCount > 0 && (
                    <div className="mt-2 inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                        {pendingCount} pending message{pendingCount > 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setStatusFilter('')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${!statusFilter ? 'bg-wiria-blue-dark text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setStatusFilter('NEW')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === 'NEW' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    New
                </button>
                <button
                    onClick={() => setStatusFilter('RESPONDED')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === 'RESPONDED' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Responded
                </button>
                <button
                    onClick={() => setStatusFilter('ARCHIVED')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === 'ARCHIVED' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Archived
                </button>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center">Loading messages...</div>
                ) : contacts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No messages found.</div>
                ) : (
                    contacts.map((contact) => (
                        <div key={contact.id} className={`bg-white rounded-xl shadow p-6 ${contact.status === 'NEW' ? 'border-l-4 border-yellow-500' : ''}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg">{contact.subject}</h3>
                                    <p className="text-sm text-gray-500">
                                        From: <span className="font-semibold">{contact.name}</span> ({contact.email})
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[contact.status]}`}>
                                        {contact.status}
                                    </span>
                                    <span className="text-xs text-gray-400">{formatDate(contact.createdAt)}</span>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4 line-clamp-2">{contact.message}</p>
                            {contact.response && (
                                <div className="bg-green-50 p-3 rounded-lg mb-4">
                                    <p className="text-xs text-green-600 font-bold mb-1">Your Response:</p>
                                    <p className="text-sm text-green-700">{contact.response}</p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedContact(contact)}
                                    className="text-wiria-blue-dark hover:underline text-sm font-bold"
                                >
                                    View Full Message
                                </button>
                                {contact.status === 'NEW' && (
                                    <button
                                        onClick={() => { setSelectedContact(contact); setShowReplyModal(true); }}
                                        className="text-green-600 hover:underline text-sm font-bold"
                                    >
                                        Reply
                                    </button>
                                )}
                                {contact.status !== 'ARCHIVED' && (
                                    <button
                                        onClick={() => handleArchive(contact.id)}
                                        className="text-gray-500 hover:underline text-sm font-bold"
                                    >
                                        Archive
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* View Message Modal */}
            {selectedContact && !showReplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Message Details</h3>
                            <button onClick={() => setSelectedContact(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">From</p>
                                    <p className="font-semibold">{selectedContact.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                    <p>{selectedContact.email}</p>
                                </div>
                                {selectedContact.phone && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Phone</p>
                                        <p>{selectedContact.phone}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Received</p>
                                    <p>{formatDate(selectedContact.createdAt)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Subject</p>
                                <p className="font-semibold text-lg">{selectedContact.subject}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Message</p>
                                <p className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>
                            {selectedContact.response && (
                                <div>
                                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Your Response</p>
                                    <p className="bg-green-50 p-4 rounded-lg text-green-700">{selectedContact.response}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex gap-3">
                            {selectedContact.status === 'NEW' && (
                                <Button onClick={() => setShowReplyModal(true)}>Reply</Button>
                            )}
                            <Button variant="secondary" onClick={() => setSelectedContact(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">Reply to {selectedContact.name}</h3>
                            <p className="text-sm text-gray-500">Re: {selectedContact.subject}</p>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Reply
                            </label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className={`w-full border rounded-lg p-3 h-40 ${replyText.trim().length > 0 && !isReplyValid
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                    } focus:ring-2 focus:outline-none transition-colors`}
                                placeholder="Type your reply here... (minimum 10 characters)"
                                maxLength={MAX_REPLY_LENGTH}
                            />
                            <div className="mt-2 flex justify-between items-center text-sm">
                                <div>
                                    {replyText.trim().length > 0 && replyText.trim().length < MIN_REPLY_LENGTH && (
                                        <span className="text-red-600">
                                            Minimum {MIN_REPLY_LENGTH} characters required
                                        </span>
                                    )}
                                    {isReplyValid && (
                                        <span className="text-green-600">✓ Ready to send</span>
                                    )}
                                </div>
                                <span className={`${replyText.length > MAX_REPLY_LENGTH * 0.9 ? 'text-orange-600 font-semibold' : 'text-gray-500'
                                    }`}>
                                    {replyText.length} / {MAX_REPLY_LENGTH}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 border-t flex gap-3">
                            <Button onClick={handleReply} disabled={isSubmitting || !isReplyValid}>
                                {isSubmitting ? 'Sending...' : 'Send Reply'}
                            </Button>
                            <Button variant="secondary" onClick={() => { setShowReplyModal(false); setReplyText(''); }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
