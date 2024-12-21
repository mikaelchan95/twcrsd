import { useState, useEffect } from 'react';
import { Settings, defaultSettings, settingsSchema } from '../types/settings';

const SETTINGS_KEY = 'restaurant_dashboard_settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const validated = settingsSchema.parse(parsed);
        setSettings(validated);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      const validated = settingsSchema.parse(updated);
      setSettings(validated);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(validated));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
      return false;
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error resetting settings:', err);
      setError('Failed to reset settings');
      return false;
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
    error
  };
}