import React, { useMemo } from 'react';
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
  background-color: ${props =>
    props.theme.customColors?.leftNavBgColor ??
    props.theme.colors.default.primaryDark};
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
    props.selected
      ? props.theme.customColors?.leftNavHighlightColor ?? 'white'
      : 'transparent'};
  :hover {
    background: ${props => props.theme.colors.default.primary};
  }
  padding: 0.5625rem 0rem 0.75rem 3.25rem;
  text-transform: uppercase;
  ${props =>
    props.theme.customColors?.leftNavTextColor
      ? `color: ${props.theme.customColors?.leftNavTextColor};`
      : props.selected
        ? `color: ${props.theme.colors.default.primary};`
        : 'color: #6e7d7f;'}
  font-family: ${props => props.theme.typography.primary.bold};
  cursor: pointer;
  display: block;
  text-decoration: none;
  width: calc(100% - 1.625rem);
  margin: auto;
  font-size: 1.1rem;
  box-sizing: border-box;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
`;

const LeftNav = withTheme(({ children }) => {
  const { organizations } = useSelector(store => store);
  let [searchParams] = useSearchParams();

  let selectedOrgUid = useMemo(() => {
    if (organizations?.length === 1) {
      return organizations[0].orgUid;
    }
    return searchParams.get('orgUid');
  }, [organizations]);

  return (
    <Container>
      <NavContainer>
        {organizations?.length > 1 && (
          <MenuItem
            selected={!selectedOrgUid}
            to={constants.ROUTES.retirementExplorer}
          >
            All Organizations
          </MenuItem>
        )}
        <div></div>
        {organizations &&
          organizations.map(organization => (
            <React.Fragment key={organization.orgUid}>
              <MenuItem
                selected={selectedOrgUid === organization.orgUid}
                to={`${constants.ROUTES.retirementExplorer}?orgUid=${organization.orgUid}`}
              >
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
          {typeof process !== 'undefined' &&
            process?.env?.REACT_APP_VERSION &&
            `v${process?.env?.REACT_APP_VERSION}`}
        </Body>
      </StyledAppVersion>
    </Container>
  );
});

export { LeftNav };
