import React from 'react';
import styled from 'styled-components';

import logo from '../../assets/img/logo.png';

const LogoContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${props => props.theme.colors.default.secondary};
  font-family: ${props => props.theme.typography.primary.bold};
  gap: 10px;
  font-size: 1rem;
  text-transform: uppercase;
`;

const ExplorerLogo = ({ width, height }) => {
  return (
    <LogoContainer>
      <img src={logo} width={height} height={width} />
      Climate Explorer
    </LogoContainer>
  );
};

export { ExplorerLogo };
