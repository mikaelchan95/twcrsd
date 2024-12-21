import React, { useState } from 'react';
import { Mail, Share2 } from 'lucide-react';
import { SalesData } from '../../../types/sales';
import { sendEmailReport } from '../../../services/email/emailService';
import { shareReport } from '../../../services/share/shareService';
import { format } from 'date-fns';

interface Props {
  data: SalesData[];
  onShare?: () => void;
  onEmail?: () => void;
}

export default function ShareActions({ data, onShare, onEmail }: Props) {
  const [isEmailing, setIsEmailing] = useState(false);

  const handleShare = async () => {
    const period = format(new Date(data[0].date), 'MMMM yyyy');
    await shareReport(data, {
      title: 'Monthly Sales Report',
      period
    });
    onShare?.();
  };

  const handleEmail = async () => {
    setIsEmailing(true);
    try {
      const period = format(new Date(data[0].date), 'MMMM yyyy');
      await sendEmailReport(data, {
        to: 'reports@example.com',
        subject: `Sales Report - ${period}`,
        period
      });
      onEmail?.();
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Share2 className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Share Report</span>
        </div>
      </button>

      <button
        onClick={handleEmail}
        disabled={isEmailing}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Email Report</span>
        </div>
        {isEmailing && (
          <span className="text-sm text-gray-500">Sending...</span>
        )}
      </button>
    </div>
  );
}