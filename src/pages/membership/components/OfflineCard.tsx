import { memo } from 'react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';

export const OfflineInfoCard = memo(function OfflineInfoCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mb-8 overflow-hidden border-2 border-wiria-yellow bg-white shadow-xl">
        <div className="h-2 bg-gradient-to-r from-wiria-yellow to-amber-500" />
        <CardBody>
          <div className="py-8 text-center">
            <div className="mb-4 text-6xl">👋</div>
            <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark">Membership Information</h2>
            <p className="mx-auto mb-6 max-w-xl text-gray-700">
              Thank you for your interest in joining WIRIA CBO! Our online registration system is
              currently being set up. Please check back soon or contact us directly to become a
              member.
            </p>
            <div className="mx-auto mb-6 max-w-md rounded-xl bg-gray-50 p-6">
              <h3 className="mb-3 font-bold text-gray-900">Membership Fees</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Individual Registration:</span>
                  <span className="font-semibold">KES 500</span>
                </div>
                <div className="flex justify-between">
                  <span>Individual Subscription:</span>
                  <span className="font-semibold">KES 1,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Group Registration (per member):</span>
                  <span className="font-semibold">KES 250</span>
                </div>
                <div className="flex justify-between">
                  <span>Group Subscription (per member):</span>
                  <span className="font-semibold">KES 500</span>
                </div>
              </div>
            </div>
            <Link to="/contact">
              <Button size="lg" className="px-10">
                Contact Us to Register
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
});
