import { useState } from 'react';
import { Career, createCareer, updateCareer } from '@/features/admin/api/careers.api';
import { Button } from '@/shared/components/ui/Button';
import { notificationService } from '@/shared/services/notification/notificationService';
import { Modal } from '@/shared/components/ui/Modal';

interface CareerModalProps {
  career: Career | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CareerModal({ career, onClose, onSuccess }: CareerModalProps) {
  const [responsibilities, setResponsibilities] = useState<string[]>(
    career?.responsibilities || ['', '', '']
  );
  const [requirements, setRequirements] = useState<string[]>(career?.requirements || ['', '', '']);
  const [desirable, setDesirable] = useState<string[]>(career?.desirable || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev: string[]) => {
      const n = [...prev];
      n[index] = value;
      return n;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const data: Partial<Career> = {
      title: rawData['title'] as string,
      employmentType: rawData['employmentType'] as Career['employmentType'],
      location: rawData['location'] as string,
      deadline: new Date(rawData['deadline'] as string).toISOString(),
      salary: (rawData['salary'] as string) || undefined,
      summary: rawData['summary'] as string,
      description: rawData['description'] as string,
      responsibilities: responsibilities.filter((r: string) => r.trim()),
      requirements: requirements.filter((r: string) => r.trim()),
      desirable: desirable.filter((r: string) => r.trim()),
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={career ? 'Edit Job Posting' : 'Post New Job'}
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="career-title">
              Job Title *
            </label>
            <input
              id="career-title"
              name="title"
              defaultValue={career?.title}
              className="w-full rounded-xl border-gray-200 p-3 transition-all focus:ring-2 focus:ring-wiria-blue-dark"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="career-employmentType">
              Employment Type *
            </label>
            <select
              id="career-employmentType"
              name="employmentType"
              defaultValue={career?.employmentType}
              className="w-full rounded-xl border-gray-200 p-3"
              required
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="CONSULTANCY">Consultancy</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="career-location">
              Location *
            </label>
            <input
              id="career-location"
              name="location"
              defaultValue={career?.location}
              className="w-full rounded-xl border-gray-200 p-3"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="career-deadline">
              Deadline *
            </label>
            <input
              id="career-deadline"
              type="datetime-local"
              name="deadline"
              defaultValue={
                career?.deadline ? new Date(career.deadline).toISOString().slice(0, 16) : ''
              }
              className="w-full rounded-xl border-gray-200 p-3"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700" htmlFor="career-salary">
              Salary Range
            </label>
            <input
              id="career-salary"
              name="salary"
              defaultValue={career?.salary}
              className="w-full rounded-xl border-gray-200 p-3"
              placeholder="e.g. KES 50k-80k"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700" htmlFor="career-summary">
            Summary (Short) *
          </label>
          <textarea
            id="career-summary"
            name="summary"
            defaultValue={career?.summary}
            className="h-20 w-full resize-none rounded-xl border-gray-200 p-3"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700" htmlFor="career-description">
            Full Description *
          </label>
          <textarea
            id="career-description"
            name="description"
            defaultValue={career?.description}
            className="h-32 w-full rounded-xl border-gray-200 p-3"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Responsibilities *</label>
            {responsibilities.map((r: string, i: number) => (
              <input
                key={i}
                aria-label={`Responsibility ${i + 1}`}
                value={r}
                onChange={(e) => handleArrayChange(setResponsibilities, i, e.target.value)}
                className="mb-2 w-full rounded-xl border-gray-200 p-3"
              />
            ))}
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Requirements *</label>
            {requirements.map((r: string, i: number) => (
              <input
                key={i}
                aria-label={`Requirement ${i + 1}`}
                value={r}
                onChange={(e) => handleArrayChange(setRequirements, i, e.target.value)}
                className="mb-2 w-full rounded-xl border-gray-200 p-3"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700">Desirable Skills (Optional)</label>
          {desirable.map((d: string, i: number) => (
            <input
              key={i}
              aria-label={`Desirable skill ${i + 1}`}
              value={d}
              onChange={(e) => handleArrayChange(setDesirable, i, e.target.value)}
              className="mb-2 w-full rounded-xl border-gray-200 p-3"
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 border-t pt-8">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Job Posting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
