import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Career, getAdminCareers, createCareer, updateCareer, deleteCareer } from '@/features/admin/api/careers.api';
import { Opportunity, Application, getAdminOpportunities, getApplications, createOpportunity, updateOpportunity, deleteOpportunity } from '@/features/admin/api/opportunities.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { ApplicationReviewModal } from '@/features/admin/components/applications/ApplicationReviewModal';
import { CareersTab, OpportunitiesTab, ApplicationsList } from '@/features/admin/components/hr';

type TabType = 'JOBS' | 'OPPORTUNITIES' | 'APPLICATIONS';

export default function HRManagementPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const appIdParam = searchParams.get('appId');

    const [activeTab, setActiveTab] = useState<TabType>(() => {
        if (tabParam === 'opportunities') return 'OPPORTUNITIES';
        if (tabParam === 'applications') return 'APPLICATIONS';
        return 'JOBS';
    });

    const [applicationsTab, setApplicationsTab] = useState<'JOBS' | 'OPPS'>('JOBS');

    const [careers, setCareers] = useState<Career[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
    const [showCareerModal, setShowCareerModal] = useState(false);
    const [showOppModal, setShowOppModal] = useState(false);
    const [reviewApp, setReviewApp] = useState<Application | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [careersRes, oppsRes, appsRes] = await Promise.all([
                getAdminCareers(),
                getAdminOpportunities(),
                getApplications()
            ]);

            // Helper to extract array from varying API response structures
            const extractArray = <T,>(res: unknown): T[] => {
                if (Array.isArray(res)) return res;
                const resObj = res as Record<string, unknown>;
                if (resObj?.['data'] && Array.isArray(resObj['data'])) return resObj['data'] as T[];
                const dataObj = resObj?.['data'] as Record<string, unknown> | undefined;
                if (dataObj?.['data'] && Array.isArray(dataObj['data'])) return dataObj['data'] as T[];
                return [];
            };

            setCareers(extractArray<Career>(careersRes));
            setOpportunities(extractArray<Opportunity>(oppsRes));
            setApplications(extractArray<Application>(appsRes));
        } catch (error) {
            console.error(error);
            notificationService.error('Failed to load HR data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handle deep-linking
    useEffect(() => {
        if (appIdParam && applications.length > 0 && !isLoading) {
            const app = applications.find(a => a.id === appIdParam);
            if (app) {
                setReviewApp(app);
                setSearchParams({}); // Clear params after finding
            }
        }
    }, [appIdParam, applications, isLoading, setSearchParams]);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setSearchParams({ tab: tab.toLowerCase() });
    };

    const handleDeleteCareer = async (id: string) => {
        if (!confirm('Delete this job posting?')) return;
        try {
            await deleteCareer(id);
            notificationService.success('Job posting deleted');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to delete job posting');
        }
    };

    const handleDeleteOpp = async (id: string) => {
        if (!confirm('Delete this opportunity?')) return;
        try {
            await deleteOpportunity(id);
            notificationService.success('Opportunity deleted');
            loadData();
        } catch (_error) {
            notificationService.error('Failed to delete opportunity');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🧑‍💼</span>
                    <h1 className="text-3xl font-bold text-wiria-blue-dark">HR & Careers Management</h1>
                </div>
                <p className="text-gray-500">Manage job postings, community opportunities, and applicant reviews in one place.</p>
            </div>

            {/* Main Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => handleTabChange('JOBS')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'JOBS' ? 'bg-white text-wiria-blue-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Job Openings
                </button>
                <button
                    onClick={() => handleTabChange('OPPORTUNITIES')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'OPPORTUNITIES' ? 'bg-white text-wiria-blue-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Opportunities
                </button>
                <button
                    onClick={() => handleTabChange('APPLICATIONS')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'APPLICATIONS' ? 'bg-white text-wiria-blue-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Applications
                    {applications.filter(a => a.status === 'PENDING').length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {applications.filter(a => a.status === 'PENDING').length}
                        </span>
                    )}
                </button>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-wiria-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading management portal...</p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'JOBS' && (
                        <CareersTab
                            careers={careers}
                            applications={applications}
                            onEdit={(c: Career) => { setEditingCareer(c); setShowCareerModal(true); }}
                            onDelete={handleDeleteCareer}
                            onCreate={() => { setEditingCareer(null); setShowCareerModal(true); }}
                        />
                    )}

                    {activeTab === 'OPPORTUNITIES' && (
                        <OpportunitiesTab
                            opportunities={opportunities}
                            applications={applications}
                            onEdit={(o: Opportunity) => { setEditingOpp(o); setShowOppModal(true); }}
                            onDelete={handleDeleteOpp}
                            onCreate={() => { setEditingOpp(null); setShowOppModal(true); }}
                        />
                    )}

                    {activeTab === 'APPLICATIONS' && (
                        <div>
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${applicationsTab === 'JOBS' ? 'border-wiria-blue-dark text-wiria-blue-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    onClick={() => setApplicationsTab('JOBS')}
                                >
                                    Job Applications ({applications.filter(a => a.careerId).length})
                                </button>
                                <button
                                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${applicationsTab === 'OPPS' ? 'border-wiria-blue-dark text-wiria-blue-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    onClick={() => setApplicationsTab('OPPS')}
                                >
                                    Opportunity Applications ({applications.filter(a => a.opportunityId).length})
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <ApplicationsList
                                    applications={applications.filter(a => applicationsTab === 'JOBS' ? a.careerId : a.opportunityId)}
                                    onReview={setReviewApp}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modals - Simplified for now by re-using bits or moving them if needed */}
            {showCareerModal && (
                <CareerModal
                    career={editingCareer}
                    onClose={() => setShowCareerModal(false)}
                    onSuccess={() => { setShowCareerModal(false); loadData(); }}
                />
            )}

            {showOppModal && (
                <OpportunityModal
                    opportunity={editingOpp}
                    onClose={() => setShowOppModal(false)}
                    onSuccess={() => { setShowOppModal(false); loadData(); }}
                />
            )}

            {reviewApp && (
                <ApplicationReviewModal
                    application={reviewApp}
                    onClose={() => setReviewApp(null)}
                    onSuccess={() => { setReviewApp(null); loadData(); }}
                />
            )}
        </div>
    );
}

// CareerModal and OpportunityModal are kept inline for now due to their
// tight coupling with the page's form submission logic
function CareerModal({ career, onClose, onSuccess }: { career: Career | null; onClose: () => void; onSuccess: () => void }) {
    const [responsibilities, setResponsibilities] = useState<string[]>(career?.responsibilities || ['', '', '']);
    const [requirements, setRequirements] = useState<string[]>(career?.requirements || ['', '', '']);
    const [desirable, setDesirable] = useState<string[]>(career?.desirable || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter((prev: string[]) => { const n = [...prev]; n[index] = value; return n; });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData: any = Object.fromEntries(formData.entries());

        const data = {
            ...rawData,
            deadline: new Date(rawData.deadline).toISOString(),
            responsibilities: responsibilities.filter(r => r.trim()),
            requirements: requirements.filter(r => r.trim()),
            desirable: desirable.filter(r => r.trim()),
        };

        try {
            if (career) await updateCareer(career.id, data);
            else await createCareer(data);
            notificationService.success(career ? 'Updated' : 'Created');
            onSuccess();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error';
            notificationService.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">{career ? 'Edit Job Posting' : 'Post New Job'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-4xl leading-none">&times;</button>
                </div>
                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/30">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="career-title">Job Title *</label>
                                <input id="career-title" name="title" defaultValue={career?.title} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-wiria-blue-dark transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="career-employmentType">Employment Type *</label>
                                <select id="career-employmentType" name="employmentType" defaultValue={career?.employmentType} className="w-full border-gray-200 rounded-xl p-3" required>
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="CONSULTANCY">Consultancy</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="career-location">Location *</label>
                                <input id="career-location" name="location" defaultValue={career?.location} className="w-full border-gray-200 rounded-xl p-3" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="career-deadline">Deadline *</label>
                                <input id="career-deadline" type="datetime-local" name="deadline" defaultValue={career?.deadline ? new Date(career.deadline).toISOString().slice(0, 16) : ''} className="w-full border-gray-200 rounded-xl p-3" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="career-salary">Salary Range</label>
                                <input id="career-salary" name="salary" defaultValue={career?.salary} className="w-full border-gray-200 rounded-xl p-3" placeholder="e.g. KES 50k-80k" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="career-summary">Summary (Short) *</label>
                            <textarea id="career-summary" name="summary" defaultValue={career?.summary} className="w-full border-gray-200 rounded-xl p-3 h-20 resize-none" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="career-description">Full Description *</label>
                            <textarea id="career-description" name="description" defaultValue={career?.description} className="w-full border-gray-200 rounded-xl p-3 h-32" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700">Responsibilities *</label>
                                {responsibilities.map((r, i) => (
                                    <input key={i} aria-label={`Responsibility ${i + 1}`} value={r} onChange={e => handleArrayChange(setResponsibilities, i, e.target.value)} className="w-full border-gray-200 rounded-xl p-3 mb-2" />
                                ))}
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700">Requirements *</label>
                                {requirements.map((r, i) => (
                                    <input key={i} aria-label={`Requirement ${i + 1}`} value={r} onChange={e => handleArrayChange(setRequirements, i, e.target.value)} className="w-full border-gray-200 rounded-xl p-3 mb-2" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700">Desirable Skills (Optional)</label>
                            {desirable.map((d, i) => (
                                <input key={i} aria-label={`Desirable skill ${i + 1}`} value={d} onChange={e => handleArrayChange(setDesirable, i, e.target.value)} className="w-full border-gray-200 rounded-xl p-3 mb-2" />
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 pt-8 border-t">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Job Posting'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function OpportunityModal({ opportunity, onClose, onSuccess }: { opportunity: Opportunity | null; onClose: () => void; onSuccess: () => void }) {
    const [responsibilities, setResponsibilities] = useState<string[]>(opportunity?.responsibilities || ['', '', '']);
    const [requirements, setRequirements] = useState<string[]>(opportunity?.requirements || ['', '', '']);
    const [benefits, setBenefits] = useState<string[]>(opportunity?.benefits || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter((prev: string[]) => { const n = [...prev]; n[index] = value; return n; });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData: any = Object.fromEntries(formData.entries());

        const data = {
            ...rawData,
            responsibilities: responsibilities.filter(r => r.trim()),
            requirements: requirements.filter(r => r.trim()),
            benefits: benefits.filter(r => r.trim()),
        };

        try {
            if (opportunity) await updateOpportunity(opportunity.id, data);
            else await createOpportunity(data);
            notificationService.success('Success');
            onSuccess();
        } catch (_error) {
            notificationService.error('Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">{opportunity ? 'Edit Opportunity' : 'New Opportunity'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-4xl leading-none">&times;</button>
                </div>
                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/30">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-title">Title *</label>
                                <input id="opportunity-title" name="title" defaultValue={opportunity?.title} className="w-full border-gray-200 rounded-xl p-3" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-type">Type *</label>
                                <select id="opportunity-type" name="type" defaultValue={opportunity?.type} className="w-full border-gray-200 rounded-xl p-3" required>
                                    <option value="INTERNSHIP">Internship</option>
                                    <option value="VOLUNTEER">Volunteer</option>
                                    <option value="FELLOWSHIP">Fellowship</option>
                                    <option value="ATTACHMENT">Industrial Attachment</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-category">Category *</label>
                                <input id="opportunity-category" name="category" defaultValue={opportunity?.category} className="w-full border-gray-200 rounded-xl p-3" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="opportunity-location">Location *</label>
                                <input id="opportunity-location" name="location" defaultValue={opportunity?.location} className="w-full border-gray-200 rounded-xl p-3" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700">Responsibilities (One per line) *</label>
                                {responsibilities.map((r, i) => (
                                    <input key={i} aria-label={`Opportunity responsibility ${i + 1}`} value={r} onChange={e => handleArrayChange(setResponsibilities, i, e.target.value)} className="w-full border-gray-200 rounded-xl p-3 mb-2" />
                                ))}
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700">Requirements (One per line) *</label>
                                {requirements.map((r, i) => (
                                    <input key={i} aria-label={`Opportunity requirement ${i + 1}`} value={r} onChange={e => handleArrayChange(setRequirements, i, e.target.value)} className="w-full border-gray-200 rounded-xl p-3 mb-2" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700">Benefits (One per line)</label>
                            {benefits.map((b, i) => (
                                <input key={i} aria-label={`Benefit ${i + 1}`} value={b} onChange={e => handleArrayChange(setBenefits, i, e.target.value)} className="w-full border-gray-200 rounded-xl p-3 mb-2" />
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 pt-8 border-t">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Publish Opportunity'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

