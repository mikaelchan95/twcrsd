import React, { useState } from 'react';
import { FileDown, Printer, FileText, Table } from 'lucide-react';
import { SalesData } from '../../../types/sales';
import { generateExcelData } from '../../../services/export/excelExport';
import { generatePDFData } from '../../../services/export/pdfExport';

interface Props {
  data: SalesData[];
  onExport?: () => void;
  onPrint?: () => void;
}

export default function ExportActions({ data, onExport, onPrint }: Props) {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      const blob = await (format === 'excel' ? generateExcelData(data) : generatePDFData(data));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report.${format === 'excel' ? 'csv' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onExport?.();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setShowExportOptions(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <button
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileDown className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export Report</span>
          </div>
          {isExporting && (
            <span className="text-sm text-gray-500">Exporting...</span>
          )}
        </button>

        {showExportOptions && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <button
              onClick={() => handleExport('excel')}
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50"
            >
              <Table className="h-4 w-4 text-green-600" />
              <span>Export to Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 text-red-600" />
              <span>Export to PDF</span>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onPrint}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Printer className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Print Report</span>
        </div>
      </button>
    </div>
  );
}