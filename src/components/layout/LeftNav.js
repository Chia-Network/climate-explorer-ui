import React, { useEffect, useMemo, useState } from 'react';
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
    props.color ?? props.theme.colors.default.primaryDark};
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
    props.selected ? props.highlightColor ?? 'white' : 'transparent'};
  :hover {
    background: ${props => props.theme.colors.default.primary};
  }
  padding: 0.5625rem 0rem 0.75rem 3.25rem;
  text-transform: uppercase;
  ${props => `color: ${props.color ?? props.theme.colors.default.primary};`}
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
  const [colors, setColors] = useState({
    topBarBgColor: undefined,
    leftNavHighlightColor: undefined,
    leftNavBgColor: undefined,
    leftNavTextColor: undefined,
  });
  function notifyParentWhenLeftNavLoaded() {
    window.parent.postMessage('leftNavLoaded', window.location.origin);
  }

  useEffect(() => {
    const handleMessage = event => {
      if (event.data.colors) {
        setColors(event.data.colors);
      }
    };
    notifyParentWhenLeftNavLoaded();

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  let selectedOrgUid = useMemo(() => {
    if (organizations?.length === 1) {
      return organizations[0].orgUid;
    }
    return searchParams.get('orgUid');
  }, [organizations]);

  return (
    <Container>
      <NavContainer color={colors.leftNavBgColor}>
        {organizations?.length > 1 && (
          <MenuItem
            selected={!selectedOrgUid}
            color={colors.leftNavTextColor}
            highlightColor={colors.leftNavHighlightColor}
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
                color={colors.leftNavTextColor}
                highlightColor={colors.leftNavHighlightColor}
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
