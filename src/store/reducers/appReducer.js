import u from 'updeep';

import { actions as appActions } from '../actions/appActions';
import constants from '../../constants';
import theme from '../../theme';

const initialState = {
  showProgressOverlay: false,
  theme: constants.THEME.DEFAULT,
  errorMessage: null,
  locale: null,
  customTheme: theme,
  connectionCheck: true,
  notification: null,
  refresh: false,
  explorerData: null,
  paginationNrOfPages: null,
  organizations: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case appActions.SET_EXPLORER_DATA:
      return u({ explorerData: action.payload }, state);

    case appActions.SET_PAGINATION_NR_OF_PAGES:
      return u({ paginationNrOfPages: action.payload }, state);

    case appActions.SET_ORGANIZATIONS:
      return u({ organizations: action.payload }, state);

    case appActions.REFRESH_APP:
      return u({ refresh: action.payload }, state);

    case appActions.ACTIVATE_PROGRESS_INDICATOR:
      return u({ showProgressOverlay: true }, state);

    case appActions.DEACTIVATE_PROGRESS_INDICATOR:
      return u({ showProgressOverlay: false }, state);

    case appActions.SET_GLOBAL_ERROR_MESSAGE:
      return u({ errorMessage: action.payload }, state);

    case appActions.CLEAR_GLOBAL_ERROR_MESSAGE:
      return u({ errorMessage: null }, state);

    case appActions.SET_LOCALE:
      return u({ locale: action.payload }, state);

    case appActions.SET_THEME:
      if (
        action.payload === constants.THEME.LIGHT ||
        action.payload === constants.THEME.DARK
      ) {
        return u({ theme: action.payload }, state);
      }
      return state;

    case appActions.TOGGLE_THEME:
      // eslint-disable-next-line
      const theme =
        state.theme === constants.THEME.DARK
          ? constants.THEME.LIGHT
          : constants.THEME.DARK;
      localStorage.setItem('theme', theme);
      return u({ theme }, state);
    case appActions.SET_CUSTOM_THEME:
      return u({ customTheme: action.payload }, state);

    case appActions.CONNECTION_CHECK:
      return u({ connectionCheck: action.payload }, state);

    case appActions.SET_NOTIFICATION:
      return u({ notification: action.payload }, state);

    case appActions.SIGN_USER_IN:
      return u(
        {
          serverAddress: action.payload.insertedServerAddress,
        },
        state,
      );

    case appActions.SIGN_USER_OUT:
      return u(
        {
          apiKey: null,
          serverAddress: null,
        },
        state,
      );

    default:
      return state;
  }
};

export { appReducer };
