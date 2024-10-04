import { ComponentCenteredSpinner, IssuanceInformation, Modal, Tabs, UnitInformation } from '@/components';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { useGetActivityByWarehouseUnitIdQuery } from '@/api';
import { ActivitySummaryInformation } from '@/components/blocks/layout/ActivitySummaryInformation';

interface DetailsModalProps {
  warehouseUnitId: string;
  onClose: () => void;
}

const ActivityDetailsModal: React.FC<DetailsModalProps> = ({ onClose, warehouseUnitId }) => {
  const {
    data: activityData,
    isLoading: activityDataLoading,
    error: activityDataError,
  } = useGetActivityByWarehouseUnitIdQuery(warehouseUnitId);

  const modalBody = () => {
    if (activityDataLoading) {
      return (
        <div style={{ height: '400px' }}>
          <ComponentCenteredSpinner />
        </div>
      );
    }

    if (!activityData || activityDataError) {
      return (
        <div className="flex justify-center items-center w-full h-full" style={{ height: '400px' }}>
          <div className="sentence-case">
            <FormattedMessage id="cannot-get-activity-details" />.
          </div>
        </div>
      );
    }

    return (
      <Tabs>
        <Tabs.Item
          title={
            <p className="capitalize">
              <FormattedMessage id="summary" />
            </p>
          }
        >
          <div style={{ height: '600px' }}>
            <ActivitySummaryInformation activity={activityData} />
          </div>
        </Tabs.Item>
        <Tabs.Item
          title={
            <p className="capitalize">
              <FormattedMessage id="unit" />
            </p>
          }
        >
          <div style={{ height: '600px' }}>
            <UnitInformation unit={activityData.cw_unit} />
          </div>
        </Tabs.Item>
        {activityData?.cw_unit?.issuance && (
          <Tabs.Item
            title={
              <p className="capitalize">
                <FormattedMessage id="issuance" />
              </p>
            }
          >
            <div style={{ height: '600px' }}>
              <IssuanceInformation issuance={activityData.cw_unit.issuance} />
            </div>
          </Tabs.Item>
        )}
      </Tabs>
    );
  };

  return (
    <Modal onClose={onClose} show={true} size={'6xl'}>
      <Modal.Header>
        <p className="capitalize">
          <FormattedMessage id="activity-details" />
        </p>
      </Modal.Header>
      <Modal.Body>{modalBody()}</Modal.Body>
    </Modal>
  );
};

export { ActivityDetailsModal };
