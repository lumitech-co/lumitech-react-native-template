import { createSelectors } from '../lib';
import { useAuthStore } from './store';

export const useAuthStoreSelectors = createSelectors(useAuthStore);
