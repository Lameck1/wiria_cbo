import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';

export const PendingPaymentCard = memo(function PendingPaymentCard() {
    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card className="mb-8 border-2 border-blue-500 bg-white">
                <CardBody>
                    <div className="py-6 text-center">
                        <Spinner size="lg" className="mx-auto mb-4 border-blue-500" />
                        <h3 className="mb-2 text-xl font-bold text-wiria-blue-dark">Waiting for Payment</h3>
                        <p className="mb-4 text-gray-700">
                            Please check your phone and complete the M-Pesa payment.
                        </p>
                        <div className="inline-block animate-pulse rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                            We're checking your payment status...
                        </div>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
});
