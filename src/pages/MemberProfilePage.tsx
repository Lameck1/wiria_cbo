import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';

import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { ProfileFormSchema, profileSchema } from '@/features/membership/validation';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { FormField } from '@/shared/components/ui/form';
import { Spinner } from '@/shared/components/ui/Spinner';
import { notificationService } from '@/shared/services/notification/notificationService';

interface ProfileFieldProps {
  label: string;
  value?: string | string[];
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="rounded-xl bg-gray-50/50 p-4 border border-gray-100/50">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">
        {Array.isArray(value) ? value.join(', ') : value ?? '--'}
      </p>
    </div>
  );
}

type MemberProfile = ReturnType<typeof useMemberData>['profile'];

interface MemberProfileViewProps {
  profile: MemberProfile;
  onEdit: () => void;
}

function MemberProfileView({ profile, onEdit }: MemberProfileViewProps) {
  return (
    <div id="profile-view">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-wiria-blue-dark">Profile Information</h2>
          <p className="text-sm text-gray-500">Your personal and contact details</p>
        </div>
        <Button onClick={onEdit} variant="outline">
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileField
          label="Full Name"
          value={`${profile?.firstName} ${profile?.lastName}`}
        />
        <ProfileField label="Email Address" value={profile?.email} />
        <ProfileField label="Phone Number" value={profile?.phone} />
        <ProfileField label="National ID" value={profile?.nationalId} />
        <ProfileField label="Occupation" value={profile?.occupation} />
        <ProfileField label="Address" value={profile?.address} />
        <ProfileField label="County" value={profile?.county} />
        <ProfileField label="Sub-County" value={profile?.subcounty} />
        <ProfileField label="Ward" value={profile?.ward} />
        <div className="md:col-span-2">
          <ProfileField label="Interests" value={profile?.interests} />
        </div>
        <div className="md:col-span-2">
          <ProfileField label="Skills" value={profile?.skills} />
        </div>
      </div>
    </div>
  );
}

interface MemberProfileEditFormProps {
  isSaving: boolean;
  onSubmit: (data: ProfileFormSchema) => Promise<void>;
  onCancel: () => void;
}

function MemberProfileEditForm({ isSaving, onSubmit, onCancel }: MemberProfileEditFormProps) {
  const { handleSubmit } = useFormContext<ProfileFormSchema>();

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="space-y-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-wiria-blue-dark">Edit Member Profile</h2>
        <p className="text-sm text-gray-500">Keep your information up to date</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="First Name" name="firstName" required />
        <FormField label="Last Name" name="lastName" required />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          placeholder="e.g. 0712345678"
        />
        <FormField label="Occupation" name="occupation" />
        <div className="md:col-span-2">
          <FormField label="Address" name="address" />
        </div>
        <FormField label="County" name="county" />
        <FormField label="Sub-County" name="subcounty" />
        <FormField label="Ward" name="ward" />
        <div className="md:col-span-2">
          <div className="space-y-1.5">
            <label
              htmlFor="interests"
              className="text-sm font-semibold text-wiria-blue-dark"
            >
              Interests
            </label>
            <Controller
              name="interests"
              render={({ field }) => (
                <input
                  {...field}
                  id="interests"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value.split(',').map((valueItem) => valueItem.trim())
                    )
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-wiria-blue-dark focus:border-wiria-blue-dark focus:ring-1 focus:ring-wiria-blue-dark outline-none transition-all"
                />
              )}
            />
            <p className="text-xs text-gray-400">Comma separated list of interests</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="space-y-1.5">
            <label htmlFor="skills" className="text-sm font-semibold text-wiria-blue-dark">
              Skills
            </label>
            <Controller
              name="skills"
              render={({ field }) => (
                <input
                  {...field}
                  id="skills"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value.split(',').map((valueItem) => valueItem.trim())
                    )
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-wiria-blue-dark focus:border-wiria-blue-dark focus:ring-1 focus:ring-wiria-blue-dark outline-none transition-all"
                />
              )}
            />
            <p className="text-xs text-gray-400">Comma separated list of skills</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" className="flex-1 h-12" isLoading={isSaving}>
          Save Changes
        </Button>
        <Button
          type="button"
          className="flex-1 h-12"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}


function MemberProfilePage() {
  const { profile, isLoading, fetchProfile, updateProfile } = useMemberData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
  });

  const { reset } = methods;

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        occupation: profile.occupation,
        address: profile.address,
        county: profile.county,
        subcounty: profile.subcounty,
        ward: profile.ward,
        interests: profile.interests,
        skills: profile.skills,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormSchema) => {
    setIsSaving(true);
    try {
      await updateProfile(data);
      notificationService.success('Profile updated successfully');
      setIsEditing(false);
    } catch {
      notificationService.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <PortalLayout title="Member Profile">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PortalLayout>
    );
  }
  return (
    <PortalLayout title="Member Profile" subtitle="View and manage your profile information">
      <div className="max-w-4xl">
        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-wiria-blue-dark via-wiria-yellow to-wiria-green-light" />

          <CardBody className="p-8">
            <FormProvider {...methods}>
              {!isEditing && profile && (
                <MemberProfileView profile={profile} onEdit={() => setIsEditing(true)} />
              )}
              {isEditing && (
                <MemberProfileEditForm
                  isSaving={isSaving}
                  onSubmit={onSubmit}
                  onCancel={() => setIsEditing(false)}
                />
              )}
            </FormProvider>
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

export default MemberProfilePage;
