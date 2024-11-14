import { createSlice } from '@reduxjs/toolkit';
import initialState from './app.initialstate';

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocale: (state, { payload }) => {
      state.locale = payload;
    },
    setHost: (state, { payload }) => {
      state.apiHost = payload.apiHost;

      if (payload.apiKey) {
        state.apiKey = payload.apiKey;
      }
    },
    setConfigLoaded: (state, { payload }: { payload: { configLoaded: boolean } }) => {
      state.configFileLoaded = payload.configLoaded;
    },
    setIsCoreRegistryUiApp: (state, { payload }: { payload: { isCoreRegistryUiApp: boolean } }) => {
      state.isCoreRegistryUiApp = payload.isCoreRegistryUiApp;
    },
    resetApiHost: (state) => {
      state.apiHost = initialState.apiHost;
      state.apiKey = initialState.apiKey;
    },
    toggleThemeMode: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
  },
});

export const { setLocale, setHost, resetApiHost, setConfigLoaded, setIsCoreRegistryUiApp, toggleThemeMode } =
  appSlice.actions;

export default appSlice.reducer;
