import { useState, useEffect } from 'react';
import type { SalesData } from '../types/sales';
import { 
  getAllSalesData, 
  addSalesData as addSalesDataToDb,
  updateSalesData as updateSalesDataInDb,
  clearSalesData as clearSalesDataFromDb
} from '../services/supabase/sales';

export function useSalesData() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await getAllSalesData();
        if (isMounted) {
          setSalesData(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading sales data:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load sales data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const addSalesData = async (newData: SalesData[]) => {
    try {
      setError(null);
      await addSalesDataToDb(newData);
      const updatedData = await getAllSalesData();
      setSalesData(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add sales data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateSalesData = async (updatedData: SalesData[]) => {
    try {
      setError(null);
      await updateSalesDataInDb(updatedData);
      setSalesData(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update sales data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearSalesData = async () => {
    try {
      setError(null);
      await clearSalesDataFromDb();
      setSalesData([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear sales data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    salesData,
    addSalesData,
    updateSalesData,
    clearSalesData,
    isLoading,
    error
  };
}