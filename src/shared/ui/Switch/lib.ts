import { Colors } from 'themes';
import { match } from 'ts-pattern';

export const constructSwitchBackgroundColor = (
  value: boolean,
  disabled: boolean,
) =>
  match<{ value: boolean; disabled: boolean }, keyof typeof Colors>({
    value,
    disabled,
  })
    .with({ value: false, disabled: true }, () => 'basic_100')
    .with({ value: false, disabled: false }, () => 'basic_200')
    .with({ value: true, disabled: false }, () => 'basic_300')
    .with({ value: true, disabled: true }, () => 'basic_400')
    .exhaustive();

export const constructSwitchCircleColor = (value: boolean, disabled: boolean) =>
  match<{ value: boolean; disabled: boolean }, keyof typeof Colors>({
    value,
    disabled,
  })
    .with({ value: false, disabled: true }, () => 'basic_100')
    .with({ value: true, disabled: true }, () => 'basic_200')
    .otherwise(() => 'basic_100');

export const constructSwitchBorderColor = (value: boolean, disabled: boolean) =>
  match<{ value: boolean; disabled: boolean }, keyof typeof Colors>({
    value,
    disabled,
  })
    .with({ value: false, disabled: false }, () => 'basic_100')
    .with({ value: true, disabled: false }, () => 'basic_200')
    .with({ value: false, disabled: true }, () => 'basic_300')
    .with({ value: true, disabled: true }, () => 'basic_400')
    .exhaustive();
