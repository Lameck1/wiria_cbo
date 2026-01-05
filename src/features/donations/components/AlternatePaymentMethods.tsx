/**
 * Alternate Payment Methods Component
 * Displays bank account details for direct bank transfers
 */

interface BankDetail {
    label: string;
    value: string;
}

const BANK_DETAILS: BankDetail[] = [
    { label: 'Bank Name:', value: 'Kenya Commercial Bank' },
    { label: 'Account Name:', value: 'WIRIA CBO' },
    { label: 'Account Number:', value: '1234567890' },
];

export function AlternatePaymentMethods() {
    return (
        <div className="mt-12 bg-white border border-gray-200 p-8 rounded-xl text-center shadow-sm">
            <h3 className="text-xl font-bold text-wiria-blue-dark mb-4">
                Other Ways to Give
            </h3>
            <p className="text-gray-600 mb-4">
                You can also donate directly to our bank account:
            </p>
            <div className="inline-block bg-gray-50 p-6 rounded-lg text-left">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    {BANK_DETAILS.map((detail) => (
                        <div key={detail.label} className="contents">
                            <span className="text-gray-500">{detail.label}</span>
                            <span className="font-semibold">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
