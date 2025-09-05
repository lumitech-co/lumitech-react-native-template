import { useMMKVDevTools } from '@rozenite/mmkv-plugin';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';
import { queryClient } from 'api';
import { storage } from 'services';

export const useDebug = () => {
  useTanStackQueryDevTools(queryClient);

  useNetworkActivityDevTools();

  useMMKVDevTools({
    storages: [storage],
  });
};
