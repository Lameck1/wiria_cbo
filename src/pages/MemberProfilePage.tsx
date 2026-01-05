/**
 * Member Profile Page
 * View and edit member profile information
 */

import { useEffect, useState } from 'react';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData, MemberProfile } from '@/features/membership/hooks/useMemberData';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Spinner } from '@/shared/components/ui/Spinner';
import { notificationService } from '@/shared/services/notification/notificationService';

function MemberProfilePage() {
    const { profile, isLoading, fetchProfile, updateProfile } = useMemberData();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<MemberProfile>>({});

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFormData({
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
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile(formData);
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

    const ProfileField = ({ label, value }: { label: string; value?: string | string[] }) => (
        <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{label}</p>
            <p className="text-lg font-semibold text-gray-800">
                {Array.isArray(value) ? value.join(', ') : value || '--'}
            </p>
        </div>
    );

    return (
        <PortalLayout title="Member Profile" subtitle="View and manage your profile information">
            <div className="max-w-4xl">
                <div className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                    {/* Decorative border top */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-wiria-blue-dark via-wiria-yellow to-wiria-green-light" />

                    {/* View Mode */}
                    {!isEditing && (
                        <div id="profile-view">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-wiria-blue-dark">Profile Information</h2>
                                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileField label="Full Name" value={`${profile?.firstName} ${profile?.lastName}`} />
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
                    )}

                    {/* Edit Mode */}
                    {isEditing && (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <h2 className="text-2xl font-bold text-wiria-blue-dark mb-6 text-center">
                                Edit Member Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Occupation"
                                    name="occupation"
                                    value={formData.occupation || ''}
                                    onChange={handleChange}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Address"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <Input
                                    label="County"
                                    name="county"
                                    value={formData.county || ''}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Sub-County"
                                    name="subcounty"
                                    value={formData.subcounty || ''}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Ward"
                                    name="ward"
                                    value={formData.ward || ''}
                                    onChange={handleChange}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Interests (comma separated)"
                                        name="interests"
                                        value={Array.isArray(formData.interests) ? formData.interests.join(', ') : ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            interests: e.target.value.split(',').map(s => s.trim())
                                        }))}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="Skills (comma separated)"
                                        name="skills"
                                        value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            skills: e.target.value.split(',').map(s => s.trim())
                                        }))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    variant="primary"
                                    isLoading={isSaving}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
}

export default MemberProfilePage;
