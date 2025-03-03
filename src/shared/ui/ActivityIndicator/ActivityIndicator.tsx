import React from 'react';
import { ActivityIndicator as Indicator } from 'react-native';
import { Box } from 'themes';
import { AnimatedBackdrop } from '../AnimatedBackDrop';

interface ActivityIndicatorProps {
  isVisible: boolean;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  isVisible,
}) => {
  return (
    <>
      <AnimatedBackdrop isVisible={isVisible} />

      {isVisible && (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Indicator size="large" />
        </Box>
      )}
    </>
  );
};
