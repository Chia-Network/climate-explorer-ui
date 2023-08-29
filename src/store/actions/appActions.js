import _ from 'lodash';
import constants from '../../constants';

import { keyMirror } from '../store-functions';
import { LANGUAGE_CODES } from '../../translations';

import explorerDataStub from '../mocks/explorerStub.json';
import { getISODateWithHoursAndMinutes } from '../../utils/dateUtils';

export const actions = keyMirror(
  'ACTIVATE_PROGRESS_INDICATOR',
  'DEACTIVATE_PROGRESS_INDICATOR',
  'TOGGLE_THEME',
  'SET_THEME',
  'SET_GLOBAL_ERROR_MESSAGE',
  'CLEAR_GLOBAL_ERROR_MESSAGE',
  'SET_LOCALE',
  'CONNECTION_CHECK',
  'SET_NOTIFICATION',
  'REFRESH_APP',
  'SET_EXPLORER_DATA',
  'SET_PAGINATION_NR_OF_PAGES',
  'SET_ORGANIZATIONS',
  'SIGN_USER_IN',
  'SIGN_USER_OUT',
);

export const signIn = ({ insertedServerAddress }) => {
  return async dispatch => {
    console.log(insertedServerAddress);
    if (insertedServerAddress) {
      localStorage.setItem(
        'climateExplorerRemoteServerAddress',
        insertedServerAddress,
      );
      dispatch({
        type: actions.SIGN_USER_IN,
        payload: {
          insertedServerAddress,
        },
      });
      dispatch(refreshApp(true));
    }
  };
};

export const signOut = () => {
  return async dispatch => {
    localStorage.removeItem('climateExplorerRemoteServerAddress');
    dispatch({
      type: actions.SIGN_USER_OUT,
      payload: {
        serverAddress: null,
      },
    });
  };
};

export const refreshApp = render => ({
  type: actions.REFRESH_APP,
  payload: render,
});

export const setPaginationNrOfPages = number => ({
  type: actions.SET_PAGINATION_NR_OF_PAGES,
  payload: number,
});

export const setOrganizations = organizations => ({
  type: actions.SET_ORGANIZATIONS,
  payload: organizations,
});

export const activateProgressIndicator = {
  type: actions.ACTIVATE_PROGRESS_INDICATOR,
};

export const deactivateProgressIndicator = {
  type: actions.DEACTIVATE_PROGRESS_INDICATOR,
};

export const setThemeFromLocalStorage = {
  type: actions.SET_THEME,
  payload: localStorage.getItem('theme'),
};

export const toggleTheme = {
  type: actions.TOGGLE_THEME,
};

export const setGlobalErrorMessage = message => ({
  type: actions.SET_GLOBAL_ERROR_MESSAGE,
  payload: message,
});

export const clearGlobalErrorMessage = {
  type: actions.CLEAR_GLOBAL_ERROR_MESSAGE,
};

export const setConnectionCheck = bool => ({
  type: actions.CONNECTION_CHECK,
  payload: bool,
});

export const NotificationMessageTypeEnum = {
  error: 'error',
  success: 'success',
  null: 'null',
};

export const setNotificationMessage = (type, id) => {
  return async dispatch => {
    if (
      _.includes(Object.keys(NotificationMessageTypeEnum), type) &&
      typeof id === 'string'
    ) {
      dispatch({
        type: actions.SET_NOTIFICATION,
        payload: {
          id,
          type,
        },
      });
    }
    if (type === null) {
      dispatch({
        type: actions.SET_NOTIFICATION,
        payload: null,
      });
    }
  };
};

export const setLocale = locale => {
  let localeToSet = locale;

  // Default to en-US if language isnt supported
  if (
    !Object.keys(LANGUAGE_CODES)
      .map(key => LANGUAGE_CODES[key])
      .includes(locale)
  ) {
    localeToSet = 'en-US';
  }

  return {
    type: actions.SET_LOCALE,
    payload: localeToSet,
  };
};

export const getExplorerData = ({
  page,
  resultsLimit,
  searchQuery,
  searchSource,
  orgUid,
  isRequestMocked,
}) => {
  return async dispatch => {
    const areRequestDetailsValid =
      typeof page === 'number' && typeof resultsLimit === 'number';
    const isSearchValid = searchQuery?.length > 0 && searchSource?.length > 0;

    if (areRequestDetailsValid) {
      let url = `${constants.API_HOST}/activities?page=${page}&limit=${resultsLimit}`;

      if (isSearchValid) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
        url += `&search_by=${searchSource}`;
      }

      // TODO - REFACTOR TO FILTERED ENDPOINT THAT IS PASSED ORGUID
      const isOrgUidNotSelected = !orgUid;
      const onSuccessHandler = results => {
        const activities = results.activities.reduce((acc, item) => {
          if (isOrgUidNotSelected) {
            return [
              ...acc,
              {
                ...item,
                icon: item.cw_org.icon,
                registry_project_id: item.cw_project.projectId,
                project_name: item.cw_project.projectName,
                vintage_year: item.cw_unit.vintageYear,
                action: item.mode.includes('RETIREMENT')
                  ? 'RETIREMENT'
                  : item.mode,
                quantity: item.amount / 1000,
                timestamp_UTC: getISODateWithHoursAndMinutes(
                  item.timestamp * 1000,
                ),
                orgUid: item.cw_org.orgUid,
                warehouseProjectId: item.cw_project.warehouseProjectId,
                projectLink: item.cw_project.projectLink,
                cw_unit: null,
                beneficiary_key: item.beneficiary_address,
              },
            ];
          } else if (item.cw_org.orgUid === orgUid) {
            return [
              ...acc,
              {
                ...item,
                icon: item.cw_org.icon,
                registry_project_id: item.cw_project.projectId,
                project_name: item.cw_project.projectName,
                vintage_year: item.cw_unit.vintageYear,
                action: item.mode.includes('RETIREMENT')
                  ? 'RETIREMENT'
                  : item.mode,
                quantity: item.amount / 1000,
                timestamp_UTC: getISODateWithHoursAndMinutes(
                  item.timestamp * 1000,
                ),
                orgUid: item.cw_org.orgUid,
                warehouseProjectId: item.cw_project.warehouseProjectId,
                projectLink: item.cw_project.projectLink,
                cw_unit: null,
                beneficiary_key: item.beneficiary_address,
              },
            ];
          } else return acc;
        }, []);

        // TODO - REFACTOR TO ORG ENDPOINT
        const organizations = results.activities.reduce(
          (uniqueOrganizations, currentActivity) => {
            const isCurrentActivityOrgNotAdded = !uniqueOrganizations.find(
              orgItem => orgItem.orgUid === currentActivity.cw_org.orgUid,
            );
            if (isCurrentActivityOrgNotAdded) {
              return [...uniqueOrganizations, { ...currentActivity.cw_org }];
            }
            return uniqueOrganizations;
          },
          [],
        );
        dispatch(setOrganizations(organizations));

        dispatch({
          type: 'SET_EXPLORER_DATA',
          payload: activities,
        });
        dispatch(
          setPaginationNrOfPages(Math.ceil(results.total / resultsLimit)),
        );
      };

      const failedMessageId = 'explorer-data-not-loaded';
      const responseStub = explorerDataStub;

      dispatch(
        fetchWrapper({
          url,
          failedMessageId,
          onSuccessHandler,
          isRequestMocked,
          responseStub,
        }),
      );
    }
  };
};

const maybeServerOverrideFetch = async (originalUrl, payload) => {
  const serverAddress = localStorage.getItem(
    'climateExplorerRemoteServerAddress',
  );

  // If serverAddress is valid, replace the domain of the original URL.
  if (serverAddress && typeof serverAddress === 'string') {
    const serverUrl = new URL(serverAddress);
    originalUrl = new URL(originalUrl);

    // Remove trailing slash from serverUrl.pathname if it exists
    let serverPathname = serverUrl.pathname;
    serverPathname = serverPathname.replace(/\/$/, '');

    // Replace the domain of the original URL with the server URL domain.
    // Also, append the server URL's pathname to the original URL's pathname.
    // And, maintain the query parameters from the original URL.
    const newUrl = new URL(
      serverPathname + originalUrl.pathname + originalUrl.search,
      serverUrl,
    );

    return fetch(newUrl.toString(), payload);
  }

  // If serverAddress is not valid, return the original URL.
  return fetch(originalUrl, payload);
};

// encapsulates error handling, network failure, loader toggling and on success or failed handlers
const fetchWrapper = ({
  url,
  payload,
  successMessageId,
  failedMessageId,
  onSuccessHandler,
  onFailedHandler,
  isRequestMocked,
  responseStub,
}) => {
  return async dispatch => {
    if (isRequestMocked && responseStub) {
      onSuccessHandler(responseStub);
    } else {
      try {
        dispatch(activateProgressIndicator);
        const response = await maybeServerOverrideFetch(url, payload);

        if (response.ok) {
          dispatch(setConnectionCheck(true));

          if (successMessageId) {
            dispatch(
              setNotificationMessage(
                NotificationMessageTypeEnum.success,
                successMessageId,
              ),
            );
          }

          if (onSuccessHandler) {
            const results = await response.json();
            onSuccessHandler(results);
          }
        } else {
          const errorResponse = await response.json();

          if (failedMessageId) {
            dispatch(
              setNotificationMessage(
                NotificationMessageTypeEnum.error,
                formatApiErrorResponse(errorResponse, failedMessageId),
              ),
            );
          }

          if (onFailedHandler) {
            onFailedHandler();
          }
        }
      } catch {
        dispatch(setConnectionCheck(false));

        if (failedMessageId) {
          dispatch(
            setNotificationMessage(
              NotificationMessageTypeEnum.error,
              failedMessageId,
            ),
          );
        }

        if (onFailedHandler) {
          onFailedHandler();
        }
      } finally {
        dispatch(deactivateProgressIndicator);
      }
    }
  };
};

const formatApiErrorResponse = (
  { errors, message, error },
  alternativeResponseId,
) => {
  if (!_.isEmpty(errors) && !_.isEmpty(message)) {
    let notificationToDisplay = message + ': ';
    errors.forEach(item => {
      notificationToDisplay = notificationToDisplay.concat(item, ' ; ');
    });
    return notificationToDisplay;
  }
  if (error) {
    return error;
  }
  return alternativeResponseId;
};
