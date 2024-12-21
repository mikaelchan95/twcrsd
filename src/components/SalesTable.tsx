import React, { useState } from 'react';
import { SalesData } from '../types/sales';
import { formatCurrency, parseCurrency } from '../utils/currencyUtils';
import { ChevronDown, ChevronUp, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useSalesData } from '../hooks/useSalesData';

interface Props {
  data: SalesData[];
  onDataUpdate?: (updatedData: SalesData[]) => void;
  className?: string;
}

interface EditableCell {
  rowIndex: number;
  field: keyof SalesData;
}

export default function SalesTable({ data, className }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const { updateSalesData } = useSalesData();

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const startEditing = (rowIndex: number, field: keyof SalesData, value: number) => {
    setEditingCell({ rowIndex, field });
    setEditValue(value.toString());
  };

  const handleSave = async (rowIndex: number, field: keyof SalesData) => {
    try {
      const newValue = parseCurrency(editValue);
      const updatedData = [...data];
      const updatedDay = { ...updatedData[rowIndex], [field]: newValue };
      
      // Update derived fields
      if (field === 'totalSales' || field === 'totalPax') {
        updatedDay.perHeadSpend = updatedDay.totalPax > 0 
          ? updatedDay.totalSales / updatedDay.totalPax 
          : 0;
      }

      updatedData[rowIndex] = updatedDay;

      // Persist the update
      await updateSalesData(updatedData);
      
      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to save update:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderEditableCell = (value: number, rowIndex: number, field: keyof SalesData) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={() => handleSave(rowIndex, field)}
            className="text-green-600 hover:text-green-700"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEditingCell(null)}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span>{formatCurrency(value)}</span>
        <button
          onClick={() => startEditing(rowIndex, field, value)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sales Data Table</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Food Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bar Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wine Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Per Head
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((day, index) => (
              <React.Fragment key={day.date}>
                <tr className="group hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <button
                      onClick={() => toggleRow(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedRows.has(index) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(day.date), 'd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {renderEditableCell(day.totalSales, index, 'totalSales')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderEditableCell(day.foodSales || 0, index, 'foodSales')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderEditableCell(day.barSales || 0, index, 'barSales')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderEditableCell(day.wineSales || 0, index, 'wineSales')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderEditableCell(day.totalPax, index, 'totalPax')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(day.perHeadSpend)}
                  </td>
                </tr>
                {expandedRows.has(index) && (
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-2">Time-based Sales</h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Happy Hour:</dt>
                              <dd className="text-gray-900">{formatCurrency(day.happyHourSales || 0)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">7PM - 10PM:</dt>
                              <dd className="text-gray-900">{formatCurrency(day.salesFrom7pmTo10pm || 0)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">After 10PM:</dt>
                              <dd className="text-gray-900">{formatCurrency(day.after10pmSales || 0)}</dd>
                            </div>
                          </dl>

                          <h4 className="font-medium text-sm text-gray-900 mt-4 mb-2">Customer Metrics</h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Reservations:</dt>
                              <dd className="text-gray-900">{day.reservations || 0}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Walk-ins:</dt>
                              <dd className="text-gray-900">{day.walkIns || 0}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">No Shows:</dt>
                              <dd className="text-gray-900">{day.noShows || 0}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Cancellations:</dt>
                              <dd className="text-gray-900">{day.cancellations || 0}</dd>
                            </div>
                          </dl>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-2">Payment Methods</h4>
                          <dl className="space-y-1 text-sm">
                            {Object.entries(day.paymentMethods).map(([method, amount]) => (
                              <div key={method} className="flex justify-between">
                                <dt className="text-gray-600">{method}:</dt>
                                <dd className="text-gray-900">{formatCurrency(amount)}</dd>
                              </div>
                            ))}
                          </dl>

                          {day.promotions.length > 0 && (
                            <>
                              <h4 className="font-medium text-sm text-gray-900 mt-4 mb-2">Promotions</h4>
                              <dl className="space-y-1 text-sm">
                                {day.promotions.map((promo, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <dt className="text-gray-600">{promo.name} ({promo.sets} sets):</dt>
                                    <dd className="text-gray-900">{formatCurrency(promo.amount)}</dd>
                                  </div>
                                ))}
                              </dl>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}