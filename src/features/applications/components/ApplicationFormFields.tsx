import {
  FormField,
  FormSelectField,
  FormTextareaField,
  FormCheckboxField,
} from '@/shared/components/ui/form';

import { EDUCATION_OPTIONS, EXPERIENCE_OPTIONS } from '../types';

interface ApplicationFormFieldsProps {
  title: string;
}

export function ApplicationFormFields({ title }: ApplicationFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-4">
        <p className="text-sm text-gray-700">
          <strong>ℹ️ Note:</strong> Fill out the form below to apply for <strong>{title}</strong>.
          All fields marked with * are required.
        </p>
      </div>

      <section className="space-y-4">
        <h4 className="text-lg font-bold text-wiria-blue-dark">Personal Information</h4>
        <FormField label="Full Name" name="fullName" required placeholder="Enter your full name" />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            required
            placeholder="0712345678"
          />
        </div>
        <FormField
          label="Location/County"
          name="location"
          required
          placeholder="e.g., Homa Bay, Nairobi"
        />
      </section>

      <section className="space-y-4">
        <h4 className="text-lg font-bold text-wiria-blue-dark">Professional Background</h4>
        <FormSelectField
          label="Highest Education Level"
          name="education"
          options={EDUCATION_OPTIONS}
          required
        />
        <FormField
          label="Field of Study"
          name="fieldOfStudy"
          required
          placeholder="e.g., Public Health, Business Administration"
        />
        <FormSelectField
          label="Years of Relevant Experience"
          name="experience"
          options={EXPERIENCE_OPTIONS}
          required
        />
        <FormTextareaField
          label="Why are you interested in this position? (Min 100 chars)"
          name="motivation"
          required
          placeholder="Tell us about your background, skills, and why you are a good fit..."
          rows={5}
        />
        <FormField
          label="Relevant Skills (comma-separated)"
          name="skills"
          placeholder="e.g., Project Management, Data Analysis"
        />
      </section>

      <section className="space-y-4">
        <h4 className="text-lg font-bold text-wiria-blue-dark">Supporting Documents</h4>
        <FormField
          label="CV/Resume (Link)"
          name="cvLink"
          type="url"
          required
          placeholder="https://drive.google.com/..."
        />
        <FormField
          label="Cover Letter (Link)"
          name="coverLetterLink"
          type="url"
          placeholder="https://drive.google.com/..."
        />
      </section>

      <section className="space-y-4">
        <FormCheckboxField
          name="consent"
          required
          label="I consent to WIRIA CBO processing my personal data for recruitment purposes in accordance with Kenya Data Protection Act 2019. *"
        />
      </section>
    </div>
  );
}
