import { toast } from 'sonner-native';
import { DefaultTheme } from 'themes';
import { ViewStyle } from 'react-native';

interface ToastParams {
  position?: 'top-center' | 'bottom-center';
  title: string;
  description?: string;
}

const style: ViewStyle = {
  shadowOffset: {
    height: 1,
    width: 2,
  },
  shadowOpacity: 0.2,
  elevation: 5,
  borderRadius: 22,
  shadowColor: DefaultTheme.colors.basic_100,
};

const duration = 3500;

const onSuccess = ({ position, title, description }: ToastParams) => {
  toast.success(title, {
    position,
    description,
    style,
    styles: {
      title: {
        fontFamily: DefaultTheme.fonts.Regular,
      },
    },
    duration,
    closeButton: true,
  });
};

const onDanger = ({ position, title, description }: ToastParams) => {
  toast.error(title, {
    position,
    description,
    style,
    styles: {
      title: {
        fontFamily: DefaultTheme.fonts.Regular,
      },
    },
    duration,
    closeButton: true,
  });
};

const onWarning = ({ position, title, description }: ToastParams) => {
  toast.warning(title, {
    position,
    description,
    style,
    styles: {
      title: {
        fontFamily: DefaultTheme.fonts.Regular,
      },
    },
    duration,
    closeButton: true,
  });
};

const onHide = () => toast.dismiss();

export const ToastService = {
  onSuccess,
  onDanger,
  onHide,
  onWarning,
};
