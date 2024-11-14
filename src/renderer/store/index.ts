import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
// @ts-ignore
import { rtkQueryErrorLogger } from './middleware/rtkQueryErrorLogger';
import { appReducer } from './slices';
import { PersistState } from 'redux-persist/es/types';
import { AppState } from './slices/app/app.initialstate';
import { climateExplorerApi } from '@/api/climate-explorer/v1';

const persistAppsConfig = {
  key: 'app',
  version: 1,
  storage,
  stateReconciler: autoMergeLevel2,
};

const store = configureStore({
  reducer: {
    // @ts-ignore
    app: persistReducer(persistAppsConfig, appReducer),
    [climateExplorerApi.reducerPath]: climateExplorerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    })
      .concat(rtkQueryErrorLogger)
      .concat(climateExplorerApi.middleware),
});

const persistor = persistStore(store);

// @ts-ignore
window.store = store;

export type RootState = {
  app: AppState & PersistState;
  [climateExplorerApi.reducerPath]: ReturnType<typeof climateExplorerApi.reducer>;
};

export { store, persistor };
