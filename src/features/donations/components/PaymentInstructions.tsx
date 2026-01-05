/**
 * Payment Instructions Component
 */

import { Card, CardBody } from '@/shared/components/ui/Card';

interface PaymentInstructionsProps {
    paymentMethod: 'STK_PUSH' | 'MANUAL';
    amount: number;
    submitLabel?: string;
    accountNumber?: string;
}

export function PaymentInstructions({
    paymentMethod,
    amount,
    submitLabel = 'Submit Donation',
    accountNumber = 'DONATION'
}: PaymentInstructionsProps) {
    if (paymentMethod === 'STK_PUSH') {
        return (
            <Card className="bg-blue-50 border-2 border-blue-200">
                <CardBody>
                    <h3 className="font-semibold text-wiria-blue-dark mb-3 flex items-center gap-2">
                        <span className="text-2xl">📱</span>
                        M-Pesa STK Push Instructions
                    </h3>
                    <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">1.</span>
                            <span>Enter your M-Pesa registered phone number</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">2.</span>
                            <span>Click "{submitLabel}"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">3.</span>
                            <span>Check your phone for an M-Pesa prompt</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">4.</span>
                            <span>Enter your M-Pesa PIN to complete the payment</span>
                        </li>
                    </ol>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="bg-green-50 border-2 border-green-200">
            <CardBody>
                <h3 className="font-semibold text-wiria-blue-dark mb-3 flex items-center gap-2">
                    <span className="text-2xl">🏦</span>
                    Manual Paybill Instructions
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-gray-600 mb-2">Pay via M-Pesa Paybill:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-xs text-gray-500">Business Number:</span>
                                <p className="font-bold text-lg text-wiria-blue-dark">123456</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Account Number:</span>
                                <p className="font-bold text-lg text-wiria-blue-dark">{accountNumber}</p>
                            </div>
                        </div>
                    </div>
                    <ol className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">1.</span>
                            <span>Go to M-Pesa menu on your phone</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">2.</span>
                            <span>Select "Lipa na M-Pesa" then "Paybill"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">3.</span>
                            <span>Enter Business Number: <strong>123456</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">4.</span>
                            <span>Enter Account Number: <strong>{accountNumber}</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">5.</span>
                            <span>Enter Amount: <strong>KES {amount.toLocaleString()}</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-wiria-blue-dark">6.</span>
                            <span>Enter your M-Pesa PIN and confirm</span>
                        </li>
                    </ol>
                    <p className="text-xs text-gray-600 italic mt-3">
                        After payment, you'll receive an M-Pesa confirmation SMS. Your payment will be
                        processed within 24 hours.
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}
