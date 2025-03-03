import React from 'react';
import { Box } from 'themes';
import { AnimatedActivityIndicator } from 'ui';
import { AuthWrapper } from 'widgets';

export const Auth: React.FC = () => {
  return (
    <AuthWrapper>
      <Box flex={1} justifyContent="center" alignItems="center">
        <AnimatedActivityIndicator />
      </Box>
    </AuthWrapper>
  );
};
