import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const AppStateStatuses: Record<string, string> = {
  active: 'active',
  background: 'background',
  inactive: 'inactive',
};

interface AppStateProps {
  onChange?: (status: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}

export const useAppStateEvent = (props?: AppStateProps) => {
  const appState = useRef(AppState.currentState);

  const { onChange, onForeground, onBackground } = props || {};

  const savedOnChange = useRef(onChange);
  const savedOnForeground = useRef(onForeground);
  const savedOnBackground = useRef(onBackground);

  useEffect(() => {
    savedOnChange.current = onChange;
    savedOnForeground.current = onForeground;
    savedOnBackground.current = onBackground;
  }, [onBackground, onChange, onForeground]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const { active } = AppStateStatuses;

      if (nextAppState === active && savedOnForeground.current) {
        savedOnForeground.current();
      }

      if (
        appState.current === active &&
        savedOnBackground.current &&
        /inactive|background/.test(nextAppState)
      ) {
        savedOnBackground.current();
      }

      if (savedOnChange.current) {
        savedOnChange.current(nextAppState);
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription?.remove();
  }, []);
};
