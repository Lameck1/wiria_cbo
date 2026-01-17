/**
 * ActiveTendersSection Component
 * Displays tenders with card view on mobile and table view on desktop
 * Includes countdown timers, status badges, loading skeletons, and improved empty state
 */

import { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { TenderCard } from './TenderCard';
import { TenderCardSkeleton, TenderTableRowSkeleton } from './TenderCardSkeleton';
import { getCountdown, getStatusBadge } from './TenderCardUtils';
import { TenderModal } from './TenderModal';
import { useTenders } from '../hooks/useTenders';

import type { Tender } from '../hooks/useTenders';

interface TendersContentViewProps {
  openTenders: Tender[];
  onTenderClick: (tender: Tender) => void;
}

const ActiveTendersHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-10 text-center"
  >
    <h2 className="mb-4 text-2xl font-bold text-wiria-blue-dark md:text-3xl">Active Tenders</h2>
    <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
  </motion.div>
);

const TendersLoadingView = () => (
  <>
    <div className="space-y-4 lg:hidden">
      <TenderCardSkeleton />
      <TenderCardSkeleton />
    </div>
    <div className="hidden overflow-x-auto rounded-lg shadow-md lg:block">
      <table className="min-w-full bg-white">
        <thead className="bg-wiria-blue-dark text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Ref No.</th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Description</th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Deadline</th>
            <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          <TenderTableRowSkeleton />
          <TenderTableRowSkeleton />
        </tbody>
      </table>
    </div>
  </>
);

const TendersErrorView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
  >
    <div className="mb-4 text-5xl">😔</div>
    <p className="mb-2 font-semibold text-red-600">Failed to load tenders</p>
    <p className="text-sm text-red-500">Please refresh the page or try again later.</p>
  </motion.div>
);

const TendersEmptyView = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
  >
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <p className="mb-2 font-semibold text-gray-600">No Active Tenders</p>
    <p className="mb-4 text-sm text-gray-500">
      There are currently no open tenders. New opportunities are posted regularly.
    </p>
    <a
      href="mailto:wiriacbo@gmail.com?subject=Tender%20Inquiry"
      className="inline-flex items-center gap-2 font-semibold text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      Get notified about new tenders
    </a>
  </motion.div>
);

const TendersContentView = ({ openTenders, onTenderClick }: TendersContentViewProps) => (
  <>
    <div className="space-y-4 lg:hidden">
      <AnimatePresence mode="popLayout">
        {openTenders.map((tender, index) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            index={index}
            onClick={() => onTenderClick(tender)}
          />
        ))}
      </AnimatePresence>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="hidden overflow-x-auto rounded-lg shadow-md lg:block"
    >
      <table className="min-w-full bg-white">
        <thead className="bg-wiria-blue-dark text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Ref No.</th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Description</th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Deadline</th>
            <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {openTenders.map((tender) => {
            const { days, hours, isUrgent, isExpired } = getCountdown(tender.deadline);
            const statusBadge = getStatusBadge(tender.status, isUrgent, isExpired);
            const deadlineDate = new Date(tender.deadline);

            return (
              <tr key={tender.id} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-4">
                  <span className="font-mono text-sm text-wiria-blue-dark">{tender.refNo}</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${statusBadge.bgClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dotClass}`} />
                      {statusBadge.text}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-wiria-blue-dark">{tender.title}</p>
                  <p className="line-clamp-1 text-sm text-gray-500">{tender.description}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-700">
                    {deadlineDate.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  {!isExpired && (
                    <div
                      className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
                        isUrgent ? 'text-red-600' : 'text-blue-600'
                      }`}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onTenderClick(tender)}
                    className="rounded-lg bg-wiria-blue-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-wiria-yellow"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  </>
);

export function ActiveTendersSection() {
  const { data: tenders = [], isLoading, isError } = useTenders();
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  const openTenders = tenders.filter((tender) => tender.status === 'OPEN');

  const handleOpenModal = useCallback((tender: Tender) => {
    setSelectedTender(tender);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTender(null);
  }, []);

  return (
    <>
      <section id="tenders" className="scroll-mt-20 bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-4 lg:px-6">
          <ActiveTendersHeader />
          {isLoading ? (
            <TendersLoadingView />
          ) : isError ? (
            <TendersErrorView />
          ) : openTenders.length === 0 ? (
            <TendersEmptyView />
          ) : (
            <TendersContentView openTenders={openTenders} onTenderClick={handleOpenModal} />
          )}
        </div>
      </section>
      <TenderModal tender={selectedTender} isOpen={!!selectedTender} onClose={handleCloseModal} />
    </>
  );
}
