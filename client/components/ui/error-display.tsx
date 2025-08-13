'use client';

import { AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

type ErrorDisplayProps = {
  error: string | null;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
};

export function ErrorDisplay({
  error,
  onDismiss,
  autoDismiss = true,
  dismissTime = 5000,
}: ErrorDisplayProps) {
  useEffect(() => {
    if (autoDismiss && error && onDismiss) {
      const timer = setTimeout(() => onDismiss(), dismissTime);
      return () => clearTimeout(timer);
    }
  }, [error, autoDismiss, dismissTime, onDismiss]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full sm:w-96">
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-100">
              {error}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-4 flex-shrink-0 rounded-md inline-flex text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {autoDismiss && (
          <div className="bg-red-500 dark:bg-red-400 h-1 w-full">
            <div
              className="bg-red-400 dark:bg-red-300 h-1 animate-[dismiss_5s_linear_forwards]"
              style={{ animationDuration: `${dismissTime}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}