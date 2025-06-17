import { observable, syncState } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { StorageKeys } from 'services';
import { LoginValues } from './config';

interface AuthFormStore {
  formFields: LoginValues;
  errors: {
    email: string;
    password: string;
  };
  isSecureModeEnabled: boolean;
  didSubmit: boolean;
}

export const authFormStore$ = observable<AuthFormStore>({
  formFields: {
    email: '',
    password: '',
    rememberMe: false,
    isFaceIdEnabled: false,
  },
  errors: {
    email: '',
    password: '',
  },
  isSecureModeEnabled: true,
  didSubmit: false,
});

syncObservable(authFormStore$, {
  persist: {
    plugin: ObservablePersistMMKV,
    name: StorageKeys.AUTH_REMEMBER_ME_FIELDS,
  },
});

const useFormSyncState$ = syncState(authFormStore$);

export const resetAuthFormPersist = async () => {
  await useFormSyncState$.resetPersistence();

  authFormStore$.set({
    formFields: {
      email: '',
      password: '',
      rememberMe: false,
      isFaceIdEnabled: false,
    },
    errors: {
      email: '',
      password: '',
    },
    isSecureModeEnabled: true,
    didSubmit: false,
  });
};

export const useAuthFormStore = () => authFormStore$;
