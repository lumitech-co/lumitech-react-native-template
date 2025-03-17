import type { UseMutationResult } from '@tanstack/react-query';
import { useLatest } from 'hooks';
import { useEffect } from 'react';

type MutationEvents<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
> = {
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined,
  ) => unknown;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined,
  ) => unknown;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined,
  ) => unknown;
  onMutate?: (variables: TVariables) => unknown;
};

export const useMutationEvents = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  mutation: UseMutationResult<TData, TError, TVariables, TContext>,
  callbacks: Partial<MutationEvents<TData, TError, TVariables, TContext>>,
) => {
  const { onSuccess, onError, onSettled, onMutate } = callbacks;

  const onSuccessRef = useLatest(onSuccess);
  const onErrorRef = useLatest(onError);
  const onSettledRef = useLatest(onSettled);
  const onMutateRef = useLatest(onMutate);

  useEffect(() => {
    if (
      mutation.isSuccess &&
      onSuccessRef.current &&
      mutation.data &&
      mutation.variables
    ) {
      onSuccessRef.current(mutation.data, mutation.variables, mutation.context);
    }
  }, [mutation.isSuccess, mutation.variables, mutation.context]);

  useEffect(() => {
    if (
      mutation.isError &&
      onErrorRef.current &&
      mutation.error &&
      mutation.variables
    ) {
      onErrorRef.current(mutation.error, mutation.variables, mutation.context);
    }
  }, [mutation.isError, mutation.error, mutation.variables, mutation.context]);

  useEffect(() => {
    if (
      (mutation.isSuccess || mutation.isError) &&
      onSettledRef.current &&
      mutation.variables
    ) {
      onSettledRef.current(
        mutation.data,
        mutation.error,
        mutation.variables,
        mutation.context,
      );
    }
  }, [
    mutation.isSuccess,
    mutation.isError,
    mutation.data,
    mutation.error,
    mutation.variables,
    mutation.context,
  ]);

  useEffect(() => {
    if (
      mutation.status === 'pending' &&
      onMutateRef.current &&
      mutation.variables
    ) {
      onMutateRef.current(mutation.variables);
    }
  }, [mutation.status, mutation.variables]);
};
