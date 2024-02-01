import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { Modal } from '.';
import {
  Body,
  InputContainer,
  InputSizeEnum,
  InputVariantEnum,
  ModalFormContainerStyle,
  StandardInput,
  StyledFieldContainer,
  StyledLabelContainer,
  Tab,
  TabPanel,
  Tabs,
} from '..';
import { signIn } from '../../store/actions/appActions';
import { validateUrl } from '../../utils/urlUtils';

const ConnectContainer = styled('div')`
  background: none;
  cursor: pointer;
  align-items: center;

  color: ${props => props.theme.colors.default.primary};

  :hover {
    color: ${props => props.theme.colors.default.primary};
  }

  text-transform: uppercase;
  font-family: ${props => props.theme.typography.primary.semiBold};
`;

const StyledContainer = styled('div')`
  height: 12.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Connect = withTheme(({ openModal = false, onClose, isHeader = true }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(openModal);
  const { homeOrgUid } = useSelector(state => state);
  const [tabValue, setTabValue] = useState(0);
  const [serverAddress, setServerAddress] = useState(null);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue],
  );

  const connectToHomeOrg = () => {
    if (serverAddress && validateUrl(serverAddress)) {
      dispatch(
        signIn({
          insertedServerAddress: serverAddress,
        }),
      );
      setServerAddress(null);
    }
    setIsConnectModalOpen(false);
  };

  useEffect(() => {
    // Function to handle the message event
    const handleMessage = event => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (
        event?.data?.serverAddress &&
        validateUrl(event?.data?.serverAddress)
      ) {
        dispatch(
          signIn({
            apiKey: event?.data?.apiKey,
            serverAddress: event?.data?.serverAddress,
          }),
        );
        setServerAddress(null);
        setIsConnectModalOpen(false);
      }
    };

    // Add the event listener
    window.addEventListener('message', handleMessage, false);

    // Return a function that will be called when the component unmounts
    return () => {
      // Remove the event listener
      window.removeEventListener('message', handleMessage, false);
    };
  }, []);

  return (
    <>
      {isHeader && window.self === window.top && (
        <ConnectContainer onClick={() => setIsConnectModalOpen(true)}>
          {!homeOrgUid && <FormattedMessage id="connect-to-cw" />}
          {homeOrgUid && <FormattedMessage id="connected" />}
        </ConnectContainer>
      )}

      {isConnectModalOpen && (
        <Modal
          modalType="basic"
          label={
            homeOrgUid
              ? intl.formatMessage({ id: 'update' })
              : intl.formatMessage({ id: 'import' })
          }
          onOk={connectToHomeOrg}
          title={
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab
                label={intl.formatMessage({
                  id: 'connect-to-remote',
                })}
              />
            </Tabs>
          }
          onClose={() => (onClose ? onClose() : setIsConnectModalOpen(false))}
          body={
            <ModalFormContainerStyle>
              <TabPanel value={tabValue} index={0}>
                <StyledContainer style={{ height: 300 }}>
                  <StyledFieldContainer>
                    <StyledLabelContainer>
                      <Body>
                        *<FormattedMessage id="server-address" />{' '}
                      </Body>
                    </StyledLabelContainer>
                    <InputContainer>
                      <StandardInput
                        size={InputSizeEnum.large}
                        variant={InputVariantEnum.default}
                        value={serverAddress}
                        onChange={value => setServerAddress(value)}
                        placeholderText="http://127.0.0.1:31313"
                      />
                    </InputContainer>
                    {(serverAddress === null ||
                      validateUrl(serverAddress) === false) && (
                      <Body size="Small" color="red">
                        {intl.formatMessage({
                          id: 'add-valid-server-address',
                        })}
                      </Body>
                    )}
                  </StyledFieldContainer>
                </StyledContainer>
              </TabPanel>
            </ModalFormContainerStyle>
          }
        />
      )}
    </>
  );
});

export { Connect };
