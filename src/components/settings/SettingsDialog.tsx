import React from 'react';
import { Settings } from '../../types/settings';
import { useSettings } from '../../hooks/useSettings';
import {
  Monitor,
  Moon,
  Sun,
  Bell,
  Mail,
  Target,
  Eye,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ isOpen, onClose }: Props) {
  const { settings, updateSettings, resetSettings, isLoading } = useSettings();

  if (!isOpen) return null;

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'SGD', label: 'Singapore Dollar (S$)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' }
  ];

  const handleThemeChange = (theme: Settings['theme']) => {
    updateSettings({ theme });
  };

  const handleNotificationToggle = (key: keyof Settings['notifications']) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleTargetChange = (key: keyof Settings['targets'], value: number) => {
    updateSettings({
      targets: {
        ...settings.targets,
        [key]: value
      }
    });
  };

  const handleDisplayToggle = (key: keyof Settings['display']) => {
    updateSettings({
      display: {
        ...settings.display,
        [key]: !settings.display[key]
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value as Settings['theme'])}
                  className={`flex items-center justify-center space-x-2 p-4 rounded-lg border ${
                    settings.theme === value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Notification Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {key === 'email' ? <Mail className="h-5 w-5 text-gray-400" /> :
                     key === 'browser' ? <Bell className="h-5 w-5 text-gray-400" /> :
                     <Target className="h-5 w-5 text-gray-400" />}
                    <span className="text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key as keyof Settings['notifications'])}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      value ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Target Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Targets</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Sales Target
                </label>
                <input
                  type="number"
                  value={settings.targets.monthlySales}
                  onChange={(e) => handleTargetChange('monthlySales', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Daily Customers Target
                </label>
                <input
                  type="number"
                  value={settings.targets.dailyCustomers}
                  onChange={(e) => handleTargetChange('dailyCustomers', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reservation Rate Target (%)
                </label>
                <input
                  type="number"
                  value={settings.targets.reservationRate}
                  onChange={(e) => handleTargetChange('reservationRate', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </section>

          {/* Display Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>
            <div className="space-y-4">
              {Object.entries(settings.display).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDisplayToggle(key as keyof Settings['display'])}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      value ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={resetSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}