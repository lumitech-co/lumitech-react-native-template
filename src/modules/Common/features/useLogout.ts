import { useState } from 'react';
import { resetAllStores } from 'stores';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);

    await resetAllStores();

    setIsLoading(false);
  };

  return { onLogout, isLoading };
};
