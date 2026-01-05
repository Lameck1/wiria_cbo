/**
 * Member Registration Types
 */

export interface RegistrationFormData {
    // Personal Information
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    nationalId?: string;

    // Contact Information
    email: string;
    phoneNumber: string;

    // Address
    county: string;
    subCounty: string;
    ward: string;
    village: string;

    // Payment
    membershipFee: number;
    paymentMethod: 'STK_PUSH' | 'MANUAL';

    membershipType: 'INDIVIDUAL' | 'GROUP';
    groupName?: string;
    memberCount?: number;

    // Consent
    agreedToTerms: boolean;
    consentToDataProcessing: boolean;
}

export interface RegistrationResponse {
    data: {
        member: {
            id: string;
            membershipNumber: string;
            status: string;
        };
        checkoutRequestId?: string;
        message: string;
    };
}
