import { createSelectors } from '../lib';
import { useUserStore } from './store';

export const useUserStoreSelectors = createSelectors(useUserStore);
