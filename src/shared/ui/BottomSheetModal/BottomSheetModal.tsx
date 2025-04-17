/* eslint-disable react/display-name */
import React, { forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal as BaseBottomSheet,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type BottomPanelProps = BottomSheetProps & {
  children: React.ReactNode;
  onBackDropPress?: () => void;
};

export const BottomSheetModal = forwardRef<BaseBottomSheet, BottomPanelProps>(
  ({ children, ...rest }, ref) => {
    const { top: topSafeArea } = useSafeAreaInsets();

    const { styles } = useStyles(stylesheet);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          onPress={rest?.onBackDropPress}
          opacity={0.55}
          appearsOnIndex={1}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    return (
      <BaseBottomSheet
        ref={ref}
        backgroundStyle={styles.backgroundStyle}
        topInset={topSafeArea}
        backdropComponent={renderBackdrop}
        {...rest}>
        <BottomSheetView style={styles.container}>{children}</BottomSheetView>
      </BaseBottomSheet>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  backgroundStyle: {
    backgroundColor: theme.colors.basic_100,
  },
  container: {
    flex: 1,
  },
}));
