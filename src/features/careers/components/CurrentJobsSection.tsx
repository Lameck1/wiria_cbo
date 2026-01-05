/**
 * CurrentJobsSection Component
 * Single responsibility: Display current job openings with modal management
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
    const activeJobs = jobs.filter(job => {
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
            <section id="current-openings" className="py-16 scroll-mt-20">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="max-w-5xl mx-auto">
                        <SectionHeader
                            title="Current Openings"
                            subtitle="Explore available positions and find your next opportunity with us."
                        />

                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block">
                                        <div className="w-16 h-16 border-4 border-wiria-blue-dark/20 border-t-wiria-blue-dark rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500">Loading job openings...</p>
                                    </div>
                                </div>
                            ) : isError ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                                    <div className="text-4xl mb-4">😔</div>
                                    <p className="text-red-600 font-semibold mb-2">Failed to load job openings</p>
                                    <p className="text-red-500 text-sm">Please refresh the page or try again later.</p>
                                </div>
                            ) : activeJobs.length === 0 ? (
                                <NoOpeningsView />
                            ) : (
                                <>
                                    <div className="text-center mb-6">
                                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            {activeJobs.length} position{activeJobs.length !== 1 ? 's' : ''} available
                                        </span>
                                    </div>
                                    {activeJobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onClick={() => handleViewDetails(job)}
                                        />
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
