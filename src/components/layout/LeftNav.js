import React from 'react';
import styled, { withTheme } from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';

import { Body } from '..';
import constants from '../../constants';
import { useSelector } from 'react-redux';

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const StyledAppVersion = styled('div')`
  position: absolute;
  bottom: 12px;
  left: 50px;
`;

const NavContainer = styled('div')`
  padding-top: 40px;
  width: 16rem;
  min-width: 16rem;
  height: 100%;
  background-color: ${props => props.theme.colors.default.primaryDark};
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const StyledLastItem = styled('div')`
  min-height: 100px;
`;

const MenuItem = styled(Link)`
  background: ${props =>
    props.selected ? props.theme.colors.default.primary : 'transparent'};
  :hover {
    background: ${props =>
      !props.selected && !props.disabled && props.theme.colors.default.primary};
  }
  padding: 0.5625rem 0rem 0.5625rem 1.25rem;
  text-transform: uppercase;
  ${props =>
    props.disabled ? 'color: #BFBFBF; pointer-events: none;' : 'color: white;'}
  font-family: ${props => props.theme.typography.primary.bold};
  cursor: pointer;
  display: block;
  text-decoration: none;
  width: calc(100% - 1.625rem);
  margin: auto;
  font-size: 1.1rem;
  box-sizing: border-box;
  border-radius: 0.625rem;
  margin-bottom: 1rem;
  box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
`;

const StyledOrganizationLogo = styled('img')`
  width: 25px;
  height: 25px;
  display: block;
  padding-bottom: 10px;
`;

const LeftNav = withTheme(({ children }) => {
  const { organizations } = useSelector(store => store);
  let [searchParams] = useSearchParams();
  const selectedOrgUid = searchParams.get('orgUid');

  return (
    <Container>
      <NavContainer>
        <MenuItem
          selected={!selectedOrgUid}
          to={constants.ROUTES.retirementExplorer}
        >
          All Organizations
        </MenuItem>
        <div></div>
        {organizations &&
          organizations.map(organization => (
            <React.Fragment key={organization.orgUid}>
              <MenuItem
                selected={selectedOrgUid === organization.orgUid}
                to={`${constants.ROUTES.retirementExplorer}?orgUid=${organization.orgUid}`}
              >
                <StyledOrganizationLogo src={organization.icon} />
                {organization.name}
              </MenuItem>
              <div></div>
            </React.Fragment>
          ))}
        <StyledLastItem />
      </NavContainer>
      {children}
      <StyledAppVersion>
        <Body size="X-Small" color="white">
          {process?.env?.REACT_APP_VERSION &&
            `v${process.env.REACT_APP_VERSION}`}
        </Body>
      </StyledAppVersion>
    </Container>
  );
});

export { LeftNav };
