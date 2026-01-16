import { useState } from 'react';

import { emailJsService } from '@/shared/services/emailJsService';
import { notificationService } from '@/shared/services/notification/notificationService';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await emailJsService.sendNewsletterSubscription({ email });
      if (result.status === 'SUCCESS') {
        notificationService.success('You have been subscribed to the newsletter.');
        setEmail('');
      } else {
        notificationService.error('Failed to subscribe. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:max-w-md lg:p-8">
      <h4 className="mb-2 text-lg font-bold">Stay Updated</h4>
      <p className="mb-4 text-sm text-gray-300">
        Subscribe to our newsletter for updates on our programs and community impact.
      </p>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-wiria-yellow"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="whitespace-nowrap rounded-lg bg-wiria-green-light px-6 py-3 text-sm font-bold text-wiria-blue-dark transition-all hover:bg-green-400"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
