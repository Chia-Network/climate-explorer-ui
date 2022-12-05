import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Modal, modalTypeEnum, Body } from '../../components';
import { getISODateWithHyphens } from '../../utils/dateUtils';
import {
  convertSnakeCaseToPascalCase,
  isStringOfImageType,
  isStringOfNoValueType,
} from '../../utils/stringUtils';

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

const UnitDetailedView = ({
  onClose,
  modalSizeAndPosition,
  unit,
  keysToDisplay,
}) => {
  const intl = useIntl();

  const getShouldKeyBeDisplayed = key => {
    const isRecordRetirement = unit.action !== 'RETIREMENT';
    const isKeyARetirementKey = [
      'beneficiary_name',
      'beneficiary_key',
    ].includes(key);

    if (isRecordRetirement) {
      return true;
    }

    if (isKeyARetirementKey) {
      return false;
    }

    return true;
  };

  const getFormattedContentDependingOnKeyValue = useCallback((key, value) => {
    if (isStringOfImageType(value)) {
      return <img width="25" height="25" src={value.toString()} />;
    } else if (isStringOfNoValueType(value)) {
      return '--';
    } else if (key.includes('timestamp')) {
      return getISODateWithHyphens(value);
    } else {
      return value.toString();
    }
  }, []);

  return (
    <Modal
      modalSizeAndPosition={modalSizeAndPosition}
      onClose={onClose}
      modalType={modalTypeEnum.basic}
      title={intl.formatMessage({
        id: 'detailed-view',
      })}
      body={
        <StyledDetailedViewTabItem>
          <div style={{ width: '60%' }}>
            <StyledDetailedViewTab>
              {keysToDisplay.map(
                (key, index) =>
                  getShouldKeyBeDisplayed(key) && (
                    <StyledItem key={index}>
                      <Body size="Bold" width="100%">
                        {convertSnakeCaseToPascalCase(key)}
                      </Body>

                      <Body>
                        {getFormattedContentDependingOnKeyValue(key, unit[key])}
                      </Body>
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
