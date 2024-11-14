export interface AppState {
  locale?: string | null;
  apiHost: string;
  apiKey?: string | null;
  configFileLoaded: boolean;
  isDarkTheme: boolean;
  isCoreRegistryUiApp: boolean;
}

const initialState: AppState = {
  locale: null,
  apiHost: 'http://localhost:31313',
  apiKey: null,
  configFileLoaded: false,
  isDarkTheme: false,
  isCoreRegistryUiApp: false,
};

export default initialState;
