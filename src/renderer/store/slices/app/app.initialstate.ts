export interface AppState {
  locale?: string | null;
  apiHost: string;
  apiKey?: string | null;
  coreRegistryMode: boolean;
  configFileLoaded: boolean;
  isDarkTheme: boolean;
}

const initialState: AppState = {
  locale: null,
  apiHost: 'http://localhost:31313',
  apiKey: null,
  coreRegistryMode: false,
  configFileLoaded: false,
  isDarkTheme: false,
};

export default initialState;
