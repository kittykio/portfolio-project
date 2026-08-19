'use client';

import Error500 from '@/components/Error500';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect, useState } from 'react';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    console.error('Global Error:', error);
    // Optional: delay to show spinner briefly
    const timeout = setTimeout(() => setShowSpinner(false), 500);
    return () => clearTimeout(timeout);
  }, [error]);

  if (showSpinner) return <LoadingSpinner />;

  return <Error500 reset={reset} />;
};

export default GlobalError;
