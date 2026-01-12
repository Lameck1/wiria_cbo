/**
 * CurrentJobsSection Component

 * Uses NoOpeningsView when no jobs are available
 */

import { useState, useCallback } from 'react';
import { useCareers, Job } from '../hooks/useCareers';
import { JobCard } from './JobCard';
import { JobModal } from './JobModal';
import { JobApplicationModal } from './JobApplicationModal';
import { NoOpeningsView } from './NoOpeningsView';
import { SectionHeader } from '@/shared/components/sections/SectionHeader';

type ModalView = 'none' | 'details' | 'apply';

export function CurrentJobsSection() {
  const { data: jobs = [], isLoading, isError } = useCareers();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalView, setModalView] = useState<ModalView>('none');

  // Filter to only show active, non-expired jobs
  const activeJobs = jobs.filter((job) => {
    if (job.status !== 'ACTIVE') return false;
    const deadline = new Date(job.deadline);
    return deadline >= new Date();
  });

  const handleViewDetails = useCallback((job: Job) => {
    setSelectedJob(job);
    setModalView('details');
  }, []);

  const handleApplyNow = useCallback(() => {
    setModalView('apply');
  }, []);

  const handleBackToDetails = useCallback(() => {
    setModalView('details');
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedJob(null);
    setModalView('none');
  }, []);

  return (
    <>
      <section id="current-openings" className="scroll-mt-20 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              title="Current Openings"
              subtitle="Explore available positions and find your next opportunity with us."
            />

            <div className="space-y-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block">
                    <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark" />
                    <p className="text-gray-500">Loading job openings...</p>
                  </div>
                </div>
              ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                  <div className="mb-4 text-4xl">😔</div>
                  <p className="mb-2 font-semibold text-red-600">Failed to load job openings</p>
                  <p className="text-sm text-red-500">
                    Please refresh the page or try again later.
                  </p>
                </div>
              ) : activeJobs.length === 0 ? (
                <NoOpeningsView />
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      {activeJobs.length} position{activeJobs.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                  {activeJobs.map((job) => (
                    <JobCard key={job.id} job={job} onClick={() => handleViewDetails(job)} />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Details Modal */}
      <JobModal
        job={selectedJob}
        isOpen={modalView === 'details'}
        onClose={handleCloseModal}
        onApply={handleApplyNow}
      />

      {/* Job Application Modal */}
      <JobApplicationModal
        job={selectedJob}
        isOpen={modalView === 'apply'}
        onClose={handleCloseModal}
        onBack={handleBackToDetails}
      />
    </>
  );
}
