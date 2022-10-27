import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Modal, modalTypeEnum, Body } from '../../components';

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

  const getShouldKeyValueBeDisplayed = key => {
    const valueType = typeof unit[key];
    return valueType === 'string' || valueType === 'number';
  };

  return (
    <Modal
      modalSizeAndPosition={modalSizeAndPosition}
      onClose={onClose}
      modalType={modalTypeEnum.basic}
      title={intl.formatMessage({
        id: 'unit-detailed-view',
      })}
      body={
        <StyledDetailedViewTabItem>
          <div style={{ width: '60%' }}>
            <StyledDetailedViewTab>
              {Object.keys(unit).map(
                (key, index) =>
                  getShouldKeyValueBeDisplayed(key) && (
                    <StyledItem key={index}>
                      <Body size="Bold" width="100%">
                        {key}
                      </Body>
                      <Body>{unit[key]}</Body>
                    </StyledItem>
                  ),
              )}
            </StyledDetailedViewTab>
          </div>
        </StyledDetailedViewTabItem>
      }
      hideButtons
    />
  );
};

export { UnitDetailedView };
