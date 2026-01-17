import { memo } from 'react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';

interface RegistrationSuccessProps {
  membershipNumber: string | null;
  onStartOver: () => void;
}

export const RegistrationSuccess = memo(function RegistrationSuccess({
  membershipNumber,
  onStartOver,
}: RegistrationSuccessProps) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <Card className="mb-8 overflow-hidden border-2 border-green-500 bg-white shadow-xl shadow-green-100">
        <div className="h-2 bg-green-500" />
        <CardBody>
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mb-4 text-6xl"
            >
              🎉
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold text-green-800">Welcome to WIRIA CBO!</h2>
            <p className="mb-2 text-green-700">Your membership has been successfully activated.</p>
            <p className="mb-6 inline-block rounded-lg border border-green-100 bg-green-50 px-8 py-3 text-lg font-semibold text-green-800">
              Membership Number: <span className="ml-2 font-mono text-2xl">{membershipNumber}</span>
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/member-login">
                <Button size="lg" className="px-10">
                  Login to Member Portal
                </Button>
              </Link>
              <Button variant="outline" onClick={onStartOver} size="lg">
                Register Another Member
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});
