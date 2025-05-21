import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'services';

export const useTypedRoute = <T extends keyof RootStackParamList>() =>
  useRoute<RouteProp<RootStackParamList, T>>();
