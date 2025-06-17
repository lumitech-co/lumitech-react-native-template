import React from 'react';
import { AllOrNothing } from 'lib';
import { TextInputProps } from 'react-native';

export type InputVariant = 'primary' | 'search';

export interface AdditionalProps {
  onFocusReceive?: () => void;
  onRightPress?: () => void;
  onLeftPress?: () => void;
  type?: InputVariant;
}

export type InputProps = TextInputProps &
  AdditionalProps &
  AllOrNothing<{
    isError: boolean;
    errorMessage: string;
  }> &
  AllOrNothing<{
    isLeftIconShown: boolean;
    LeftIcon: React.ReactNode;
  }> &
  AllOrNothing<{
    isRightIconShown: boolean;
    RightIcon: React.ReactNode;
  }>;
