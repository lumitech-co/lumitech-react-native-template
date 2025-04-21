import { resetUserStorePersist } from './user/store';

export const resetAllStores = async () => {
  await resetUserStorePersist();
};
