import React, { Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { setNotificationMessage } from '../store/actions/appActions';
import * as Pages from '../pages';
import {
  createNotification,
  NotificationContainer,
} from '../utils/notificationUtils';
import {
  AppContainer,
  IndeterminateProgressOverlay,
  Dashboard,
  Connect,
} from '../components';
import constants from '../constants';

const AppNavigator = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const { showProgressOverlay, connectionCheck, notification } = useSelector(
    store => store,
  );

  useEffect(() => {
    if (notification) {
      createNotification(
        notification.type,
        intl.formatMessage({ id: notification.id }),
      );
      dispatch(setNotificationMessage(null));
    }
  }, [notification]);

  return (
    <AppContainer>
      {showProgressOverlay && <IndeterminateProgressOverlay />}
      {!connectionCheck && <Connect openModal={true} isHeader={false} />}
      <NotificationContainer />
      <Router>
        <Dashboard>
          <Suspense fallback={<IndeterminateProgressOverlay />}>
            <Routes>
              <Route
                exact
                path="/"
                element={<Navigate to={constants.ROUTES.retirementExplorer} />}
              />
              <Route
                exact
                path=""
                element={<Navigate to={constants.ROUTES.retirementExplorer} />}
              />
              <Route
                path={constants.ROUTES.retirementExplorer}
                element={<Pages.RetirementExplorerPage />}
              />
              <Route
                path="*"
                element={<Navigate to={constants.ROUTES.retirementExplorer} />}
              />
            </Routes>
          </Suspense>
        </Dashboard>
      </Router>
    </AppContainer>
  );
};

export { AppNavigator };
