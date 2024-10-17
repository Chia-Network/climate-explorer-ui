import React from 'react';
import { BrowserRouter as Router, Navigate, redirect, Route, Routes } from 'react-router-dom';
import ROUTES from '@/routes/route-constants';
import * as Pages from '@/pages';
import { Template } from '@/components';

const AppNavigator: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route // remove trailing slash
            path="*(/+)"
            loader={({ params }) => redirect(params['*'] || '/')}
          />
          <Route path="" element={<Template />}>
            <Route path="/" element={<Navigate to={ROUTES.ORG_ACTIVITIES} />} />
            <Route path={ROUTES.ORG_ACTIVITIES} element={<Pages.ActivitiesPage />} />
            <Route path={`${ROUTES.ORG_ACTIVITIES}/:orgUid`} element={<Pages.ActivitiesPage />} />
            <Route path="*" element={<Navigate replace to={ROUTES.ORG_ACTIVITIES} />} />
          </Route>
        </Routes>
        {/* app-wide blocking modals go below this comment*/}
      </Router>
    </>
  );
};

export { AppNavigator };
