/**
 * DocumentCard Component
 * Displays a document resource card with quick download, date tags, and animations
 */

import { motion } from 'framer-motion';
import { getFullFileUrl, hasValidFileUrl } from '@/shared/utils/getBackendUrl';
import type { Resource } from '../hooks/useResources';

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  GOVERNANCE: '📜',
  STRATEGIC: '🎯',
  FINANCIAL: '💰',
  POLICIES: '📋',
  REPORTS: '📊',
  OTHER: '📄',
};

// Category colors for badges
const CATEGORY_COLORS: Record<string, string> = {
  GOVERNANCE: 'bg-purple-100 text-purple-700',
  STRATEGIC: 'bg-blue-100 text-blue-700',
  FINANCIAL: 'bg-green-100 text-green-700',
  POLICIES: 'bg-amber-100 text-amber-700',
  REPORTS: 'bg-rose-100 text-rose-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

interface DocumentCardProps {
  document: Resource;
  onClick: () => void;
  index?: number;
}

export function DocumentCard({ document, onClick, index = 0 }: DocumentCardProps) {
  const icon = CATEGORY_ICONS[document.category] || '📄';
  const colorClass = CATEGORY_COLORS[document.category] || 'bg-gray-100 text-gray-700';

  // Format date
  const uploadDate = new Date(document.uploadedAt || document.createdAt);
  const formattedDate = uploadDate.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

  const hasDocument = hasValidFileUrl(document.downloadUrl);

  const handleQuickDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasDocument) return;
    const fullUrl = getFullFileUrl(document.downloadUrl);
    window.open(fullUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="document-card group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:border-wiria-blue-dark/20 hover:shadow-xl"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-wiria-blue-dark/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header with Icon and Category */}
      <div className="relative z-10 mb-4 flex items-start gap-4">
        <motion.div
          className="text-4xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${colorClass}`}
            >
              {document.category}
            </span>
            <span className="text-xs text-gray-400">Updated {formattedDate}</span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-wiria-blue-dark transition-colors group-hover:text-wiria-yellow">
            {document.title}
          </h3>
        </div>
      </div>

      {/* Summary */}
      <p className="relative z-10 mb-4 line-clamp-2 text-sm text-gray-600">{document.summary}</p>

      {/* Key Points Preview */}
      {document.keyPoints && document.keyPoints.length > 0 && (
        <ul className="relative z-10 mb-4 space-y-1 text-xs text-gray-500">
          {document.keyPoints.slice(0, 2).map((point, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-wiria-yellow" />
              <span className="line-clamp-1">{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="rounded bg-gray-100 px-2 py-1 font-medium">{document.fileType}</span>
          <span>{document.fileSize}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick Download Button */}
          <motion.button
            onClick={handleQuickDownload}
            whileHover={hasDocument ? { scale: 1.1 } : {}}
            whileTap={hasDocument ? { scale: 0.95 } : {}}
            disabled={!hasDocument}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              hasDocument
                ? 'cursor-pointer bg-wiria-blue-dark/10 text-wiria-blue-dark hover:bg-wiria-blue-dark hover:text-white'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }`}
            title={hasDocument ? 'Quick Download' : 'Document not uploaded yet'}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </motion.button>
          {/* View Details */}
          <span className="flex items-center gap-1 text-sm font-semibold text-wiria-blue-dark transition-colors group-hover:text-wiria-yellow">
            Details
            <svg
              className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
