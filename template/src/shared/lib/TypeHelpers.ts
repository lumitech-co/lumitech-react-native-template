import React, { forwardRef } from 'react';

export type PropsFromReactComponent<TComponent> = TComponent extends React.FC<
  infer Props
>
  ? Props
  : never;

export type ToUndefinedObject<T extends object> = Partial<
  Record<keyof T, undefined>
>;

export type AllOrNothing<T extends object> = T | ToUndefinedObject<T>;

export type TypedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode;

export const typedForwardRef = forwardRef as TypedForwardRef;

export const objectKeys = <T extends object>(object: T): Array<keyof T> =>
  Object.keys(object) as Array<keyof T>;
