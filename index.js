import { AppRegistry, TextInput, Text, TouchableOpacity } from 'react-native';
import { TouchableOpacity as GestureHandlerTouchableOpacity } from 'react-native-gesture-handler';
import { App } from './App';
import { touchableConfig, setDefaultProps, parseEnv } from './src/shared/lib';
import { name as appName } from './app.json';

setDefaultProps(Text, { allowFontScaling: false });
setDefaultProps(TextInput, { allowFontScaling: false });
setDefaultProps(TouchableOpacity, {
  ...touchableConfig,
  allowFontScaling: false,
});
setDefaultProps(GestureHandlerTouchableOpacity, {
  ...touchableConfig,
  allowFontScaling: false,
});

parseEnv();

AppRegistry.registerComponent(appName, () => App);
