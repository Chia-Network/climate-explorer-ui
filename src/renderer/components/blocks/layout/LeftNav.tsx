import { ReactElement, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Card, ComponentCenteredSpinner, Sidebar } from '@/components';
import ROUTES from '@/routes/route-constants';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { useGetOrganizationsListQuery } from '@/api';

const LeftNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: organizationsList, isLoading: organizationsLoading } = useGetOrganizationsListQuery();

  const isActive = useCallback((path: string) => location.pathname === path, [location]);

  const sideBarItems = (): ReactElement[] | ReactElement => {
    if (organizationsLoading) {
      return <ComponentCenteredSpinner />;
    } else if (!organizationsList) {
      return (
        <div className="sentence-case">
          <FormattedMessage id="failed-to-load-organizations" />
        </div>
      );
    } else {
      return organizationsList.map((organization) => {
        return (
          <Sidebar.Item
            style={{ cursor: 'pointer' }}
            active={isActive(`${ROUTES.ORG_ACTIVITIES}/${organization.orgUid}`)}
            onClick={() => navigate(`${ROUTES.ORG_ACTIVITIES}/${organization.orgUid}`)}
          >
            <p className="capitalize">{organization.name}</p>
          </Sidebar.Item>
        );
      });
    }
  };

  return (
    <div className="h-full relative bg-white dark:bg-gray-800">
      <div className="h-full hidden md:block">
        <Sidebar aria-label="App Navigation">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Card className="max-w-sm mb-6 shadow-none">
                <div className="flex space-x-3 justify-center items-center">
                  <MdOutlineTravelExplore size={35} />
                  <p className="capitalize">
                    <FormattedMessage id="climate-activity-exploration" />
                  </p>
                </div>
              </Card>
              {sideBarItems()}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      {/* app-wide modals */}
    </div>
  );
};

export { LeftNav };
