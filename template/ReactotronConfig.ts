/* eslint-disable import/no-extraneous-dependencies */
import Reactotron, {
  networking,
  ReactotronReactNative,
} from 'reactotron-react-native';
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query';
import { queryClient } from 'api';
import { storage } from 'services';

import mmkvPlugin from 'reactotron-react-native-mmkv';

const queryClientManager = new QueryClientManager({
  // @ts-ignore
  queryClient,
});

Reactotron.use(reactotronReactQuery(queryClientManager))
  .configure({
    onDisconnect: () => {
      queryClientManager.unsubscribe();
    },
  })
  .useReactNative()
  // @ts-ignore
  .use(networking())
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .connect();
