import { useState, useEffect, useCallback } from 'react';

interface CachedData {
  data: any;
  timestamp: number;
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveToCache = useCallback((key: string, data: any) => {
    try {
      const cached: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cached));
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  }, []);

  const getFromCache = useCallback((key: string): any | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;
      const parsed: CachedData = JSON.parse(cached);
      return parsed.data;
    } catch (error) {
      console.error('Failed to get from cache:', error);
      return null;
    }
  }, []);

  const clearCache = useCallback((key?: string) => {
    try {
      if (key) {
        localStorage.removeItem(`cache_${key}`);
      } else {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith('cache_'));
        keys.forEach((k) => localStorage.removeItem(k));
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, []);

  return {
    isOnline,
    saveToCache,
    getFromCache,
    clearCache,
  };
}
