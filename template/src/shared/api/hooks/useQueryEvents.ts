import type { UseQueryResult } from '@tanstack/react-query';
import { useLatest } from 'hooks';
import { useEffect } from 'react';

type QueryEvents<TData = unknown, TError = unknown> = {
  onSuccess?: (data: TData) => unknown;
  onError?: (error: TError) => unknown;
};

export const useQueryEvents = <TData = unknown, TError = unknown>(
  query: UseQueryResult<TData, TError>,
  callbacks: Partial<QueryEvents<TData, TError>>,
) => {
  const { onSuccess, onError } = callbacks;

  const onSuccessRef = useLatest(onSuccess);
  const onErrorRef = useLatest(onError);

  useEffect(() => {
    if (query.isSuccess && onSuccessRef.current && query.data) {
      onSuccessRef.current(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && onErrorRef.current && query.error) {
      onErrorRef.current(query.error);
    }
  }, [query.isError, query.error]);
};
