import { useState, useEffect } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import type { SalesData } from '../types/sales';

const DB_NAME = 'restaurantSalesDB';
const STORE_NAME = 'salesData';
const DB_VERSION = 1;

export function useIndexedDB() {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'date' });
            }
          },
          blocked() {
            console.warn('Database upgrade was blocked');
          },
          blocking() {
            console.warn('Database is blocking an upgrade');
          },
          terminated() {
            console.error('Database connection was terminated');
          }
        });
        
        if (isMounted) {
          setDb(database);
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        console.error('Error initializing IndexedDB:', err);
        if (isMounted) {
          setError('Failed to initialize database');
          setIsInitialized(true);
        }
      }
    };

    initDB();

    return () => {
      isMounted = false;
      if (db) {
        db.close();
      }
    };
  }, []);

  const getAllSalesData = async (): Promise<SalesData[]> => {
    if (!db) {
      return [];
    }
    try {
      return await db.getAll(STORE_NAME);
    } catch (err) {
      console.error('Error getting sales data:', err);
      throw new Error('Failed to retrieve sales data');
    }
  };

  const addSalesData = async (data: SalesData[]): Promise<void> => {
    if (!db) {
      throw new Error('Database connection lost');
    }
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      for (const item of data) {
        await store.put(item);
      }
      
      await tx.done;
    } catch (err) {
      console.error('Error adding sales data:', err);
      throw new Error('Failed to add sales data');
    }
  };

  const updateSalesData = async (data: SalesData[]): Promise<void> => {
    if (!db) {
      throw new Error('Database connection lost');
    }
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      for (const item of data) {
        await store.put(item);
      }
      
      await tx.done;
    } catch (err) {
      console.error('Error updating sales data:', err);
      throw new Error('Failed to update sales data');
    }
  };

  const clearSalesData = async (): Promise<void> => {
    if (!db) {
      throw new Error('Database connection lost');
    }
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.objectStore(STORE_NAME).clear();
      await tx.done;
    } catch (err) {
      console.error('Error clearing sales data:', err);
      throw new Error('Failed to clear sales data');
    }
  };

  return {
    getAllSalesData,
    addSalesData,
    updateSalesData,
    clearSalesData,
    error,
    isInitialized
  };
}