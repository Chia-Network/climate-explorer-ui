import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  Modal,
  modalTypeEnum,
  Tab,
  TabPanel,
  Tabs,
  UnitDetailsTab,
} from '../../components';

export const StyledDetailedViewTabItem = styled('div')`
  display: flex;
  justify-content: center;
  background: #fafafa;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 16px 21px;
  margin: 20px 0px;
  gap: 20px;
`;

export const StyledDetailedViewTab = styled('div')`
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 1rem;
`;

export const StyledItem = styled('div')`
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

const UnitDetailedView = ({ onClose, modalSizeAndPosition, unit }) => {
  const intl = useIntl();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = useCallback(
    (event, newValue) => setTabValue(newValue),
    [setTabValue],
  );

  const unitKeys = Object?.keys(unit);
  const unitDetails = {};
  const unitTabs = [];

  unitKeys?.forEach(key => {
    const keyValue = unit[key];
    if (typeof keyValue !== 'object' || keyValue === null) {
      unitDetails[key] = keyValue;
    } else if (keyValue instanceof Array && keyValue.length) {
      unitTabs.unshift({ tabName: key, tabData: keyValue });
    } else if (!(keyValue instanceof Array) && Object.keys(keyValue)?.length) {
      unitTabs.unshift({ tabName: key, tabData: keyValue });
    }
  });

  return (
    <Modal
      modalSizeAndPosition={modalSizeAndPosition}
      onClose={onClose}
      modalType={modalTypeEnum.basic}
      title={intl.formatMessage({
        id: 'detailed-view',
      })}
      body={
        <>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Unit details" />
            {unitTabs?.length > 0 &&
              unitTabs.map(tab => (
                <Tab label={tab.tabName} key={tab.tabName} />
              ))}
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <UnitDetailsTab data={unitDetails} />
          </TabPanel>
          {unitTabs?.length > 0 &&
            unitTabs.map((tab, index) => (
              <TabPanel value={tabValue} index={index + 1} key={tab.tabName}>
                <UnitDetailsTab data={tab.tabData} />
              </TabPanel>
            ))}
        </>
      }
      hideButtons
    />
  );
};

export { UnitDetailedView };
