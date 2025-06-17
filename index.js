import {
  AppRegistry,
  TextInput,
  Text,
  LogBox,
  Pressable as RNPressable,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { App } from './App';
import { setDefaultProps, parseEnv } from './src/shared/lib';
import { name as appName } from './app.json';

setDefaultProps(Text, { allowFontScaling: false });
setDefaultProps(Pressable, { allowFontScaling: false });
setDefaultProps(RNPressable, { allowFontScaling: false });
setDefaultProps(TextInput, { allowFontScaling: false });

parseEnv();

LogBox.ignoreLogs([
  `[Reanimated] Reduced motion setting is overwritten with mode 'never'`,
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  '[Reanimated] Reading from `value` during component render.',
  '[Reanimated] Reading from `value` during component render. Please ensure that you do not access the `value` property or use `get` method of a shared value while React is rendering a component.',
]);

AppRegistry.registerComponent(appName, () => App);
