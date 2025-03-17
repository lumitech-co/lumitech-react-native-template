import 'react-native-gesture-handler';
import { AppRegistry, TextInput, Text, TouchableOpacity } from 'react-native';
import { App } from './App';
import { touchableConfig, setDefaultProps, parseEnv } from './src/shared/lib';
import { LocalizationService } from './src/shared/services';
import { name as appName } from './app.json';

setDefaultProps(Text, { allowFontScaling: false });
setDefaultProps(TextInput, { allowFontScaling: false });
setDefaultProps(TouchableOpacity, touchableConfig);

parseEnv();

LocalizationService.init();

AppRegistry.registerComponent(appName, () => App);
