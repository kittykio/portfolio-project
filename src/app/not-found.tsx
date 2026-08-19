'use client';

import Error404 from '@/components/Error404';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    // Show spinner briefly (optional)
    const timeout = setTimeout(() => setShowSpinner(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (showSpinner) return <LoadingSpinner />;

  return <Error404 />;
};

export default NotFound;
