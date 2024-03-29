import React from 'react';
import { useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

const Text = styled('p')`
  color: ${props => props.color || props.theme.colors.default.onSurface};
  font-size: 1.5rem;
  font-family: ${props => props.theme.typography.primary.light};
  font-style: normal;
  font-weight: 300;
  line-height: 150%;
  letter-spacing: -0.0274rem;
`;

const Subtitle = withTheme(({ children, color }) => {
  const appStore = useSelector(state => state);
  return (
    <Text color={color} selectedTheme={appStore.theme}>
      {children}
    </Text>
  );
});

export { Subtitle };
