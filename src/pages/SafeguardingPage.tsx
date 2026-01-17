/**
 * Safeguarding Page
 * Report safeguarding concerns confidentially

 * - Softer hero gradient (not too red)
 * - Glassmorphism form card
 * - Staggered animations
 * - Collapsible sidebar on mobile
 */

import { useState } from 'react';

import { motion } from 'framer-motion';

import {
  SafeguardingReportForm,
  ReportStatusLookup,
  NoticesBanner,
  WhatHappensNext,
  DirectContactCard,
} from '@/features/safeguarding';

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Collapsible sidebar section component
function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="lg:contents">
      {/* Mobile: Collapsible */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-3 font-semibold text-wiria-blue-dark">
            {icon}
            {title}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5">{children}</div>
        </motion.div>
      </div>

      {/* Desktop: Always visible */}
      <div className="hidden lg:block">{children}</div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 py-24">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern
            id="shield-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 2 L18 6 L18 14 L10 20 L2 14 L2 6 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#shield-pattern)" />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center text-white"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Confidential Reporting
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            Report a Safeguarding Concern
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl"
          >
            Your safety matters. Report concerns confidentially and we will investigate promptly.
          </motion.p>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}

function ReportFormCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-slate-200/30 to-blue-200/30 blur-3xl" />
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-2 text-2xl font-bold text-wiria-blue-dark md:text-3xl"
      >
        Submit a Report
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 h-1 w-20 origin-left rounded-full bg-gradient-to-r from-slate-600 to-slate-400"
      />
      <p className="mb-8 text-gray-600">
        Please provide as much detail as possible. All fields marked with * are required.
      </p>
      <SafeguardingReportForm />
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <CollapsibleSection
        title="Check Report Status"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        }
        defaultOpen={false}
      >
        <ReportStatusLookup />
      </CollapsibleSection>
      <CollapsibleSection
        title="What Happens Next?"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        defaultOpen={false}
      >
        <WhatHappensNext />
      </CollapsibleSection>
      <CollapsibleSection
        title="Direct Contact"
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
        defaultOpen={false}
      >
        <DirectContactCard />
      </CollapsibleSection>
    </div>
  );
}

function SafeguardingPage() {
  return (
    <main>
      <HeroSection />

      {/* Important Notices */}
      <NoticesBanner />

      {/* Main Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-8 lg:grid-cols-3 lg:gap-12"
          >
            {/* Report Form - 2 columns with Glassmorphism */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <ReportFormCard />
            </motion.div>

            {/* Sidebar - Collapsible on Mobile */}
            <motion.div variants={itemVariants} className="space-y-4 lg:space-y-6">
              <SidebarContent />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default SafeguardingPage;
