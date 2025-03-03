import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text } from 'themes';

export const UpdateModal: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text
        textAlign="center"
        fontFamily="Medium"
        fontWeight="500"
        color="black">
        {t('update-modal.title')}
      </Text>

      <Text marginTop={16} textAlign="center" color="black">
        {t('update-modal.description')}
      </Text>
    </Box>
  );
};
