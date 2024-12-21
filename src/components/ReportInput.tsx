import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useSalesReport } from '../hooks/useSalesReport';
import type { SalesData } from '../types/sales';

interface Props {
  onDataParsed: (data: SalesData[]) => void;
}

export default function ReportInput({ onDataParsed }: Props) {
  const [report, setReport] = useState('');
  const { parseReport, error, isLoading } = useSalesReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.trim()) return;

    try {
      const data = await parseReport(report);
      onDataParsed(data);
      setReport('');
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setReport(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Sales Report Input</h2>
        <div className="text-sm text-gray-500">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            <span>Paste report or upload file</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">TXT files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".txt"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </label>
        </div>

        <div className="relative">
          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            placeholder="Paste your sales report here..."
            className="w-full h-48 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !report.trim()}
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Process Report'}
        </button>
      </form>
    </div>
  );
}