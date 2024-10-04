import { Card, InformationDisplayField } from '@/components';
import { useIntl } from 'react-intl';
import React from 'react';
import { Activity } from '@/schemas/Activity.schema';

const ActivitySummaryInformation: React.FC<{ activity: Activity }> = ({ activity }) => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InformationDisplayField
            name="benficiaryName"
            label={intl.formatMessage({ id: 'beneficiary-name' })}
            type="text"
            value={activity.beneficiary_name}
          />
          <InformationDisplayField
            name="benficiaryKey"
            label={intl.formatMessage({ id: 'beneficiary-key' })}
            type="text"
            value={activity.metadata?.ba}
          />
          <InformationDisplayField
            name="unitOwner"
            label={intl.formatMessage({ id: 'unit-owner' })}
            type="text"
            value={activity.cw_unit.unitOwner}
          />
        </div>
      </Card>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InformationDisplayField
            name="projectName"
            label={intl.formatMessage({ id: 'project-name' })}
            type="text"
            value={activity.cw_project.projectName}
          />
          <InformationDisplayField
            name="projectId"
            label={intl.formatMessage({ id: 'project-id' })}
            type="text"
            value={activity.cw_project.projectId}
          />
          <InformationDisplayField
            name="projectLocationId"
            label={intl.formatMessage({ id: 'project-location-id' })}
            type="text"
            value={activity.cw_project.projectLocations?.[0]?.id}
          />
        </div>
      </Card>
    </div>
  );
};

export { ActivitySummaryInformation };
