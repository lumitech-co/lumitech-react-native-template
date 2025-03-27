import React from 'react';
import { Box } from 'themes';
import { UnistylesRuntime } from 'react-native-unistyles';
import { AnimatedBackdrop } from '../AnimatedBackDrop';
import { AnimatedActivityIndicator } from '../AnimatedActivityIndicator';

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
        <Box
          flex={1}
          position="absolute"
          alignSelf="center"
          justifyContent="center"
          zIndex={999}
          top={UnistylesRuntime.screen.height / 2.5}>
          <AnimatedActivityIndicator />
        </Box>
      )}
    </>
  );
};
