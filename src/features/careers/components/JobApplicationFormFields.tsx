/**
 * JobApplicationFormFields Component
 * Single responsibility: Render job application form fields
 * Matches the structure of ApplicationFormFields from opportunities
 */

import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/shared/components/form';
import { JobApplicationFormData } from '../hooks/useJobApplication';

// Form constants
const EDUCATION_OPTIONS = [
    { value: '', label: 'Select education level' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD / Doctorate' },
    { value: 'other', label: 'Other' },
];

const EXPERIENCE_OPTIONS = [
    { value: '', label: 'Select experience' },
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-2', label: '1-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
];

const MINIMUM_MOTIVATION_LENGTH = 100;

interface JobApplicationFormFieldsProps {
    formData: JobApplicationFormData;
    jobTitle: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function JobApplicationFormFields({
    formData,
    jobTitle,
    onChange
}: JobApplicationFormFieldsProps) {
    return (
        <div className="space-y-6">
            {/* Info Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm text-gray-700">
                    <strong>ℹ️ Note:</strong> Fill out the form below to apply for{' '}
                    <strong>{jobTitle}</strong>. All fields marked with * are required.
                </p>
            </div>

            {/* Personal Information Section */}
            <section className="space-y-4">
                <h4 className="text-lg font-bold text-wiria-blue-dark">Personal Information</h4>

                <FormInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onChange}
                    required
                    placeholder="Enter your full name"
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        placeholder="you@example.com"
                    />
                    <FormInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={onChange}
                        required
                        placeholder="0712345678"
                    />
                </div>

                <FormInput
                    label="Location/County"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    required
                    placeholder="e.g., Homa Bay, Nairobi"
                />
            </section>

            {/* Professional Background Section */}
            <section className="space-y-4">
                <h4 className="text-lg font-bold text-wiria-blue-dark">Professional Background</h4>

                <FormSelect
                    label="Highest Education Level"
                    name="education"
                    value={formData.education}
                    onChange={onChange}
                    options={EDUCATION_OPTIONS}
                    required
                />

                <FormInput
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={onChange}
                    required
                    placeholder="e.g., Public Health, Business Administration"
                />

                <FormSelect
                    label="Years of Relevant Experience"
                    name="experience"
                    value={formData.experience}
                    onChange={onChange}
                    options={EXPERIENCE_OPTIONS}
                    required
                />

                <FormTextarea
                    label={`Why are you interested in this position? (Minimum ${MINIMUM_MOTIVATION_LENGTH} characters)`}
                    name="motivation"
                    value={formData.motivation}
                    onChange={onChange}
                    required
                    minLength={MINIMUM_MOTIVATION_LENGTH}
                    placeholder="Tell us about your background, skills, and why you are a good fit for this role..."
                    showCharCount
                    rows={5}
                />

                <FormInput
                    label="Relevant Skills (comma-separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={onChange}
                    placeholder="e.g., Project Management, Data Analysis, Community Mobilization"
                />
            </section>

            {/* Documents Section */}
            <section className="space-y-4">
                <h4 className="text-lg font-bold text-wiria-blue-dark">Supporting Documents</h4>
                <p className="text-sm text-gray-600">
                    Provide links to your documents (Google Drive, Dropbox, etc.). Make sure links are publicly accessible.
                </p>

                <FormInput
                    label="CV/Resume (Link)"
                    name="cvLink"
                    type="url"
                    value={formData.cvLink}
                    onChange={onChange}
                    required
                    placeholder="https://drive.google.com/..."
                />

                <FormInput
                    label="Cover Letter (Link)"
                    name="coverLetterLink"
                    type="url"
                    value={formData.coverLetterLink}
                    onChange={onChange}
                    required
                    placeholder="https://drive.google.com/..."
                />

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-800">
                        💡 <strong>Tip:</strong> Upload your documents to Google Drive or Dropbox, then copy the sharing link here.
                        Make sure to set the sharing permission to "Anyone with the link can view".
                    </p>
                </div>
            </section>

            {/* Consent Section */}
            <section className="space-y-4">
                <FormCheckbox
                    name="consent"
                    checked={formData.consent}
                    onChange={onChange}
                    required
                    label={
                        <>
                            I consent to WIRIA CBO processing my personal data for recruitment
                            purposes in accordance with Kenya Data Protection Act 2019. *
                        </>
                    }
                />
            </section>
        </div>
    );
}
