import { Chip } from '@mui/material';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { ToolTip, ToolTipPlacement } from '../../components';
import { getISODateWithHyphens } from '../../utils/dateUtils';
import {
  isStringOfImageType,
  isStringOfNoValueType,
} from '../../utils/stringUtils';

const Text = styled('p')`
  color: ${props => props.color || props.theme.colors.default.secondary};
  font-size: 0.875rem;
  font-family: ${props => props.theme.typography.primary.regular};
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
`;

const TableCellText = withTheme(
  ({ color, heading, value, tooltipsHeadings }) => {
    const appStore = useSelector(state => state);

    if (isStringOfImageType(value)) {
      return <img width="25" height="25" src={value.toString()} />;
    }

    if (isStringOfNoValueType(value)) {
      return (
        <Text color={color} selectedTheme={appStore.theme}>
          --
        </Text>
      );
    }

    const isHeadingADate = heading.includes('timestamp');
    if (isHeadingADate) {
      return (
        <Text color={color} selectedTheme={appStore.theme}>
          {getISODateWithHyphens(value)}
        </Text>
      );
    }

    const getChipColorDependingOnValue = useCallback(value => {
      if (value === 'RETIREMENT') return 'error';
      if (value === 'TOKENIZATION') return 'success';
      if (value === 'DETOKENIZATION') return 'primary';
    }, []);

    const isHeadingAPill = heading.includes('action');
    if (isHeadingAPill) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Chip
            label={value}
            color={getChipColorDependingOnValue(value)}
            variant="outlined"
          />
        </div>
      );
    }

    const valueToDisplay = value.toString();
    const isTooltipVisible = tooltipsHeadings.includes(heading);
    return isTooltipVisible ? (
      <ToolTip body={valueToDisplay} placement={ToolTipPlacement.Top}>
        <Text color={color} selectedTheme={appStore.theme}>
          {valueToDisplay}
        </Text>
      </ToolTip>
    ) : (
      <Text color={color} selectedTheme={appStore.theme}>
        {valueToDisplay}
      </Text>
    );
  },
);

export { TableCellText };
