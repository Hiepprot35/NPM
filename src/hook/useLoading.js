import { useState, useCallback } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async (asyncFunction) => {
    setIsLoading(true);
    try {
      await asyncFunction();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [isLoading, withLoading];
};

export default useLoading;
