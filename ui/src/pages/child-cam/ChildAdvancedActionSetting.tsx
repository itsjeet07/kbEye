import React, { ReactElement, useState } from 'react';
import { Button, AlertBar, useModal } from 'scorer-ui-kit';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CameraSettingService from '../../services/cameraSettingService';
import { CentralCameraContext } from '../../store/centralCameraSettingStore';
import ConfirmModalStartForceMode from './ChildStartForceModeConfirmationDialog';

const Container = styled.div`
  margin: 20px 20px;
  display: flex;
  width: 100%;
  @media (min-width: 1024px) and (max-width: 1279px) {
    margin: 10px 0px 40px 10px;
    max-width: 1000px;
  }
`;

const TitleArea = styled.div`
  width: 780px;
`;

const ButtonArea = styled.div`
  width: 300px;
  margin: 30px 0 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  @media (min-width: 1024px) and (max-width: 1279px) {
    width: 325px;
  }
`;

const TitleHeading = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 16px;
  font-weight: 500;
  color: #5a6269;
`;

const TextContent = styled.p`
  font-size: 14px;
  margin-top: 10px;
  color: #8b9196;
  line-height: 1.79;
  font-family: ${({ theme }) => theme.fontFamily.ui};
`;

const AlertContainer = styled.div`
  width: 950px;
  position: absolute;
  left: 200px;
  top: 40px;
  display: flex;
  justify-content: right;
  @media (min-width: 1024px) and (max-width: 1279px) {
    left: 0px;
  }
`;

interface Alert {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  key: any;
}

const ChildAdvancedActionSetting: React.FC = () => {
  const { t } = useTranslation(['ChildCameraSetting']);
  const { dispatchCentralCamera } = CentralCameraContext();
  const { createModal } = useModal();
  const [messageAlert, setMessageAlert] = useState<Alert | null>(null);

  const advancedActionHandler = () => {
    const data = {
      action: 'start',
    };
    CameraSettingService.postAdvancedAction(data).then(
      (res) => {
        dispatchCentralCamera({ type: 'POST_ADVANCED_ACTION', payload: res });
        setMessageAlert({
          key: new Date(),
          message: t('forcedModeSuccess'),
          type: 'success',
        });
      },
      () => {
        setMessageAlert({
          key: new Date(),
          message: t('forcedModeFail'),
          type: 'error',
        });
      }
    );
  };

  const clickHandler = () => {
    createModal({ isCloseEnable: false, customComponent: addPersonModalTwo });
  };
  const addPersonModalTwo: ReactElement = (
    <ConfirmModalStartForceMode handler={advancedActionHandler} />
  );

  return (
    <>
      <Container>
        <TitleArea>
          <AlertContainer>
            {messageAlert && (
              <AlertBar
                key={messageAlert.key}
                type={messageAlert.type}
                message={messageAlert.message}
              />
            )}
          </AlertContainer>
          <TitleHeading id='title'>{t('childTitle')}</TitleHeading>
          <TextContent>{t('childDescription1')}</TextContent>
          <TextContent>{t('childDescription2')}</TextContent>
        </TitleArea>
        <ButtonArea>
          <Button onClick={() => clickHandler()}>
            {t('forcedUnmannedModeStarted')}
          </Button>
        </ButtonArea>
      </Container>
    </>
  );
};

export default ChildAdvancedActionSetting;
