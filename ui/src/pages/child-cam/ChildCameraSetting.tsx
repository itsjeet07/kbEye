import React, { useState, useEffect, useCallback } from 'react';
import {
  PageHeader,
  Button,
  TabList,
  Tab,
  Tabs,
  TabContent,
  ButtonWithLoading,
  usePoll,
  Spinner,
  AlertBar,
} from 'scorer-ui-kit';
import styled from 'styled-components';
import ChildAdvancedSetting from './ChildAdvancedSetting';
import ChildAdvancedActionSetting from './ChildAdvancedActionSetting';
import { useTranslation } from 'react-i18next';
import CameraSettingService from '../../services/cameraSettingService';
import { CentralCameraContext } from '../../store/centralCameraSettingStore';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

interface ILang {
  currentLanguage: string;
}

const PageHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 23px;
`;
const SnapshotImageWrapper = styled.div`
  margin-left: 62px;
  background-color: #f2f2f2;
  width: 120px;
  height: 67.5px;
  position: relative;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin-left: 15px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin-left: 55px;
  }
`;
const SnapshotImage = styled.img`
  border-radius: 3px;
  object-fit: contain;
  width: 100%;
  height: 100%;
`;
const SpinnerContainer = styled.div`
  padding: 2px 24px;
  width: 100px;
  border-radius: 3px;
  margin: 15% auto;
  display: flex;
  justify-content: center;
  align-items: center;
  styling: 'primary';
`;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 40px;
`;

const Container = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.ui};
  padding: 40px 0 10px;
  position: relative;
  max-width:1230px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    max-width: 1024px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    max-width: 1152px;
  }
`;

const CancelButton = styled(Button)`
  margin-right: 10px;
  height: 40px;
  padding: 11px 19px 10px 20px;
  border-radius: 3px;
  background-color: #f2f2f2;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #8d8d8d;
  cursor: pointer;
`;

const SaveButton = styled(ButtonWithLoading)`
  height: 40px;
  cursor: pointer;
`;

const ButtonSection = styled.div`
  width: 780px;
  display: flex;
  justify-content: flex-end;
  margin-top: 1px;
  flex-direction: column;
`;

const UnSavedChangesText = styled.div<ILang>`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #8d8d8d;
  padding: 5px 10px 3px 10px;
  border-radius: 3px;
  border: solid 1px #eee;
  text-align: center;
  margin-top: 12px;
  min-width: ${(props) => (props.currentLanguage === 'en' ? '196px' : '265px')};
`;

const Divider = styled.div`
  height: 1px;
  margin: -14px 0 44px;
  background-color: #eee;
`;

const Tab1Container = styled.div`
  margin-top: 20px;
  margin-left: 42px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin-left: 5px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin-left: 50px;
  }
`;

const Tab2Container = styled.div`
  margin-top: 20px;
  margin-left: 42px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin-left: 5px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin-left: 55px;
  }
`;

const LogoImage = styled.img`
  width: auto;
  height: auto;
`;

const PageHeaderWrapper = styled.div`
  margin-left: 18px;
  margin-top: 25px;
  width: 300px;
`;

const TabListWrapperOne = styled.div`
  margin: 0 0 14px 60px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.09px;
  color: #0097ce;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin: 0 0 14px 15px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin: 0 0 14px 55px;
  }
`;

const TabListWrapperTwo = styled.div`
  margin: 0 0 0 0px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.09px;
  color: #767676;
`;

const ImageWrapperLogo = styled.div`
  background-color: #f2f2f2;
  width: 120px;
  height: 30px;
  margin: 0 265px 61px 42px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin: 0 265px 61px -2px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin: 0 265px 61px 38px;
  }
`;

const ForSticky = styled.div`
  position: sticky;
  top: 0px;
  z-index: 1;
  background-color: white;
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

const EmptyDiv = styled.div`
  height: 80px;
`;

export interface Alert {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  key: any;
}

export interface Image {
  streamName: string;
  original: boolean;
  streamType: string;
}

export interface Params {
  streamName: string;
  original: boolean;
  streamType: string;
}

const defaultAdvancedSettings = {
  type: 0,
  my_id: '0',
  center_id: '0',
};

const ChildCameraSetting: React.FC<{}> = () => {
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const { t } = useTranslation(['ChildCameraSetting']);
  const [messageAlert, setMessageAlert] = useState<Alert | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const pageTitle = new URLSearchParams(window.location.search).get('tab');
  const [selectedTab, setSelectedTab] = useState(
    pageTitle ? pageTitle : 'advance'
  );
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  // const [generalSetting, setGeneralSettings] = useState(defaultGeneralSettings);
  const [advancedSetting, setAdvancedSetting] = useState(
    defaultAdvancedSettings
  );
  // const { createModal } = useModal();
  const [dataSet, setDataSet] = useState({});
  const { centralCameraCtx, dispatchCentralCamera } = CentralCameraContext();
  const { childCameraSettingsData } = centralCameraCtx;
  // const isChecked = localStorage.getItem("child_advancedSetting_checked");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [settingSavedAlert, setSettingSavedAlert] = useState(false);
  const [pageHeader, setPageHeader] = useState(0);
  const curLang = localStorage.getItem('language') || 'en';
  const [currentLanguage, setCurrentLanguage] = useState<string>(curLang);

  type LabelValue = {
    [key: string]: string;
  };

  useEffect(() => {
    setDataSet({ ...childCameraSettingsData });
    setAdvancedSetting({ ...childCameraSettingsData });
    setPageHeader(childCameraSettingsData.type);
    sessionStorage.setItem('isCancel', 'false');
  }, [childCameraSettingsData]);

  useEffect(() => {
    setCurrentLanguage(curLang);
  }, [curLang]);
  //for Unsaved Changes Count
  useEffect(() => {
    function difference(object: any, base: any) {
      return _.transform(object, (result: any, value: any, key: any) => {
        if (!_.isEqual(value, base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(base[key])
              ? difference(value, base[key])
              : value;
        }
      });
    }
    const modData = { ...advancedSetting };
    const diff = difference(dataSet, modData);
    setUnsavedChanges(Object.keys(diff).length);
  }, [advancedSetting,dataSet]);

  const keepOnPage = useCallback((e) => {
    const message =
      'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
    e.preventDefault();
    e.returnValue = message;
    return message;
  }, []);

  useEffect(() => {
    if (unsavedChanges > 0) {
      window.addEventListener('beforeunload', keepOnPage);
    }
    return () => {
      window.removeEventListener('beforeunload', keepOnPage);
    };
  }, [unsavedChanges, keepOnPage]);

  useEffect(() => {
    CameraSettingService.getChildSettingsData().then((res) => {
      dispatchCentralCamera({
        type: 'GET_CHILD_CAM_DATA',
        payload: res.data.data,
      });
    });
  }, [dispatchCentralCamera]);

  function arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  usePoll(async () => {
    CameraSettingService.getChildImage(true).then(
      (res) => {
        if (res.status === 200) {
          if (res.data) {
            setImgLoaded(true);
            let imageElement = document.getElementById(
              'cameraSnapshot'
            ) as HTMLImageElement;
            if (imageElement)
              imageElement.src =
                'data:image/jpg;base64,' + arrayBufferToBase64(res.data);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, 3000);

  const validateInputs = (value: string, key: string) => {
    if (key === 'center_id' || key === 'my_id') {
      if (value.length > 0 && value.length <= 16) {
        return;
      } else {
        let errorMessage = t('errorMessage1').replace('{fieldLabel}', t(key));
        return errorMessage;
      }
    }
  };

  //save
  const onSave = async () => {
    for (const [key, value] of Object.entries({ ...advancedSetting })) {
      const errorMessage = validateInputs(
        JSON.stringify(value).replaceAll('"', ''),
        key
      );
      if (errorMessage) {
        setMessageAlert({
          key: new Date(),
          message: errorMessage,
          type: 'error',
        });
        return;
      }
    }

    setSaveLoading(true);
    CameraSettingService.putChildSettingsData(advancedSetting).then(
      (res) => {
        dispatchCentralCamera({
          type: 'PUT_CAMERA_DATA',
          payload: res.data.data,
        });
        setPageHeader(res.data.data.type);
        setUnsavedChanges(0);
        setSettingSavedAlert(true);
        setSaveLoading(false);
        setIsReadOnly(true);
        setTimeout(() => {
          setSettingSavedAlert(false);
        }, 2000);
        CameraSettingService.getChildSettingsData().then((res) => {
          dispatchCentralCamera({
            type: 'GET_CHILD_CAM_DATA',
            payload: res.data.data,
          });
        });
      },
      (err) => {
        console.error(err);
        setSaveLoading(false);
        setMessageAlert({
          key: new Date(),
          message: t('settingSavedMesFail'),
          type: 'error',
        });
      }
    );
  };
  //Cancle
  const onCancel = () => {
    sessionStorage.setItem('isCancel', 'true');
    setMessageAlert(null);
    setAdvancedSetting({ ...childCameraSettingsData });

    const redBordered = document.querySelectorAll<HTMLElement>(
      'input[border-red="true"]'
    );
    for (const ele in redBordered) {
      if (parseInt(ele) <= redBordered.length - 1)
        redBordered[ele].style.borderColor = 'hsla(120,1.3%,85.3%,1.000)';
    }
    setUnsavedChanges(0);
    setIsReadOnly(true);
    setTimeout(() => { sessionStorage.setItem('isCancel', 'false'); }, 150);
  };

  const pushNav = (tab: string) => {
    history.push('/settings?tab=' + tab);
  };

  // Edit Button
  const onEdit = () => {
    setIsReadOnly(false);
    setSaveLoading(false);
  };

  useEffect(() => {
    const title =
      childCameraSettingsData?.type === 1
        ? t('down') + ' ' + t('camera') + ' | ' + t('tabTitle')
        : childCameraSettingsData?.type === 2
          ? t('up') + ' ' + t('camera') + ' | ' + t('tabTitle')
          : childCameraSettingsData?.type === 3
            ? t('sideRoad1') + ' ' + t('camera') + ' | ' + t('tabTitle')
            : childCameraSettingsData?.type === 4
              ? t('sideRoad2') + ' ' + t('camera') + ' | ' + t('tabTitle')
              : childCameraSettingsData?.type === 5
                ? t('sideRoad3') + ' ' + t('camera') + ' | ' + t('tabTitle')
                : childCameraSettingsData?.type === 6
                  ? t('sideRoad4') + ' ' + t('camera') + ' | ' + t('tabTitle')
                  : t('Common:childCamera') + ' | ' + t('tabTitle');

    document.title = title;
  }, [t, childCameraSettingsData]);

  return (
    <Container>
      <ImageWrapperLogo>
        <a href='/'>
          <LogoImage src='./Images/KBEye logo.png' />
        </a>
      </ImageWrapperLogo>
      <AlertContainer>
        {messageAlert && (
          <AlertBar
            key={messageAlert.key}
            type={messageAlert.type}
            message={messageAlert.message}
          />
        )}
      </AlertContainer>
      <PageHeaderContainer>
        <SnapshotImageWrapper>
          {imgLoaded ? (
            <SnapshotImage
              id='cameraSnapshot'
              src=''
              width='120px'
              height='67.5px'
            />
          ) : (
            <SpinnerContainer>
              <Spinner size='medium' styling='primary' />
            </SpinnerContainer>
          )}
        </SnapshotImageWrapper>
        <PageHeaderWrapper>
          <PageHeader
            title={
              pageHeader === 1
                ? t('down') + ' ' + t('camera')
                : pageHeader === 2
                  ? t('up') + ' ' + t('camera')
                  : pageHeader === 3
                    ? t('sideRoad1') + ' ' + t('camera')
                    : pageHeader === 4
                      ? t('sideRoad2') + ' ' + t('camera')
                      : pageHeader === 5
                        ? t('sideRoad3') + ' ' + t('camera')
                        : pageHeader === 6
                          ? t('sideRoad4') + ' ' + t('camera')
                          : t('Common:childCamera')
            }
            areaHref='/'
            areaTitle={t('Common:cameraSystem')}
          />
        </PageHeaderWrapper>
        {selectedTab === 'advance' ? (
          <ButtonSection>
            <ButtonsWrapper>
              {isReadOnly && (
                <Button design='secondary' size='normal' onClick={onEdit}>
                  {t('Common:edit')}
                </Button>
              )}
              {!isReadOnly && (
                <CancelButton design='secondary' onClick={() => onCancel()}>
                  {t('Common:cancel')}
                </CancelButton>
              )}
              {!isReadOnly && (
                <SaveButton loading={saveLoading} onClick={onSave}>
                  {t('Common:save')}
                </SaveButton>
              )}
            </ButtonsWrapper>
            <ButtonsWrapper>
              {!isReadOnly && (
                <UnSavedChangesText currentLanguage={currentLanguage}>
                  {unsavedChanges}
                  {t('unsavedChanges')}
                </UnSavedChangesText>
              )}
              {settingSavedAlert ? (
                <UnSavedChangesText currentLanguage={currentLanguage}>
                  {t('settingSavedMesSuccess')}
                </UnSavedChangesText>
              ) : null}
            </ButtonsWrapper>
          </ButtonSection>
        ) : (
          <EmptyDiv />
        )}
      </PageHeaderContainer>
      <Tabs>
        <ForSticky>
          <TabList defaultTabId={selectedTab}>
            <TabListWrapperOne
              onClick={() => {
                setSelectedTab('advance');
                pushNav('advance');
              }}
            >
              <Tab tabFor='advance'>{t('advanced-WirelessSettings')}</Tab>
            </TabListWrapperOne>
            <TabListWrapperTwo
              onClick={() => {
                setSelectedTab('action');
                pushNav('action');
              }}
            >
              <Tab tabFor='action'>{t('advanced-action')}</Tab>
            </TabListWrapperTwo>
          </TabList>
          <Divider />
        </ForSticky>
        <TabContent tabId='advance'>
          <Tab1Container>
            <ChildAdvancedSetting
              advancedSetting={advancedSetting}
              setAdvancedSetting={setAdvancedSetting}
              isReadOnly={isReadOnly}
              setMessageAlert={setMessageAlert}
            />
          </Tab1Container>
        </TabContent>
        <TabContent tabId='action'>
          <Tab2Container>
            <ChildAdvancedActionSetting />
          </Tab2Container>
        </TabContent>
      </Tabs>
    </Container>
  );
};

export default ChildCameraSetting;
