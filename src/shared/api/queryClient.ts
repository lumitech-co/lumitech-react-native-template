import { QueryClient } from '@tanstack/react-query';

const garbageCollectionTime = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      gcTime: garbageCollectionTime,
    },
    queries: {
      gcTime: garbageCollectionTime,
    },
  },
});

export const getQueryClient = () => queryClient;
