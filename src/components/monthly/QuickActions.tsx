import React, { useState } from 'react';
import { SalesData } from '../../types/sales';
import ExportActions from './quick-actions/ExportActions';
import ShareActions from './quick-actions/ShareActions';
import AnalyticsActions from './quick-actions/AnalyticsActions';
import SettingsActions from './quick-actions/SettingsActions';

interface Props {
  data: SalesData[];
  onExport?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onEmail?: () => void;
}

export default function QuickActions({ 
  data,
  onExport,
  onPrint,
  onShare,
  onEmail
}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExportActions 
            data={data}
            onExport={onExport}
            onPrint={onPrint}
          />
          <ShareActions 
            data={data}
            onShare={onShare}
            onEmail={onEmail}
          />
        </div>
      </div>

      <AnalyticsActions data={data} />
      <SettingsActions 
        showSettings={showSettings}
        onShowSettings={() => setShowSettings(true)}
        onCloseSettings={() => setShowSettings(false)}
      />
    </div>
  );
}