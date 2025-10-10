import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'services';

export const useTypedRoute = <T extends keyof RootStackParamList>(
  _: T,
): RouteProp<RootStackParamList, T> => {
  return useRoute<RouteProp<RootStackParamList, T>>();
};
