import { Card, InformationDisplayField } from '@/components';
import { useIntl } from 'react-intl';
import React from 'react';
import { Activity } from '@/schemas/Activity.schema';
import { timestampToUtcString } from '@/utils/date-time-utils';

const ActivitySummaryInformation: React.FC<{ activity: Activity }> = ({ activity }) => {
  const intl = useIntl();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Card>
        <div className="grid grid-cols-4 gap-x-4">
          <InformationDisplayField
            name="action"
            label={intl.formatMessage({ id: 'action' })}
            type="climateActionMode"
            value={activity.mode}
          />
          <InformationDisplayField
            name="quantity"
            label={intl.formatMessage({ id: 'tons-co2' })}
            type="text"
            value={Math.ceil(activity.amount / 1000)}
          />
          <InformationDisplayField
            name="vintageYear"
            label={intl.formatMessage({ id: 'vintage-year' })}
            type="text"
            value={activity.cw_unit.vintageYear}
          />
          <InformationDisplayField
            name="timestampUtc"
            label={intl.formatMessage({ id: 'timestamp-utc' })}
            type="text"
            value={timestampToUtcString(activity.timestamp * 1000)}
          />
          <InformationDisplayField
            name="benficiaryName"
            label={intl.formatMessage({ id: 'beneficiary-name' })}
            type="text"
            value={activity.beneficiary_name}
          />
          <div className="col-span-3">
            <InformationDisplayField
              name="benficiaryKey"
              label={intl.formatMessage({ id: 'beneficiary-key' })}
              type="text"
              value={activity.metadata?.ba}
            />
          </div>
        </div>
      </Card>
      <Card>
        <div className="grid grid-cols-2 gap-x-4">
          <InformationDisplayField
            name="registry"
            label={intl.formatMessage({ id: 'registry' })}
            type="text"
            value={activity.cw_org.name}
          />
          <InformationDisplayField
            name="projectName"
            label={intl.formatMessage({ id: 'project-name' })}
            type="text"
            value={activity.cw_project.projectName}
          />
          <InformationDisplayField
            name="projectLink"
            label={intl.formatMessage({ id: 'project-link' })}
            type="link"
            value={activity.cw_project.projectLink}
          />
          <InformationDisplayField
            name="projectId"
            label={intl.formatMessage({ id: 'registry-project-id' })}
            type="text"
            value={activity.cw_project.projectId}
          />
        </div>
      </Card>
    </div>
  );
};

export { ActivitySummaryInformation };
