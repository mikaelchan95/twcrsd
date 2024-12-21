import React from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import SettingsDialog from '../../settings/SettingsDialog';

interface Props {
  showSettings: boolean;
  onShowSettings: () => void;
  onCloseSettings: () => void;
}

export default function SettingsActions({
  showSettings,
  onShowSettings,
  onCloseSettings
}: Props) {
  return (
    <>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button
          onClick={onShowSettings}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Settings</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Alerts</span>
        </button>
      </div>

      <SettingsDialog
        isOpen={showSettings}
        onClose={onCloseSettings}
      />
    </>
  );
}