import React, { useState, ReactElement, useEffect, useCallback, useRef } from 'react';
import {
  PageHeader,
  Button,
  TabList,
  Tab,
  Tabs,
  TabContent,
  ButtonWithLoading,
  usePoll,
  useModal,
  Spinner,
  AlertBar,
} from 'scorer-ui-kit';
import styled from 'styled-components';
import GeneralSetting from './CentralCamGeneralSetting';
import AdvancedSetting from './CentralCamAdvancedSetting';
import { useTranslation } from 'react-i18next';
import CameraSettingService from '../../services/cameraSettingService';
import { CentralCameraContext } from '../../store/centralCameraSettingStore';
import _ from 'lodash';
import ConfirmModal from './CentralCamConfirmModal';
import { useHistory } from 'react-router-dom';

interface ILang {
  currentLanguage: string;
}

const Container = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.ui};
  padding: 40px 0 10px;
  max-width: 1230px;
  position: relative;
  @media (min-width: 1024px) and (max-width: 1151px) {
    max-width: 1024px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    max-width: 1152px;
  }
`;

const PageHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 22px;
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

const LogoImage = styled.img`
  width: auto;
  height: auto;
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

const StickyContainer = styled.div`
  position: sticky;
  top: 0px;
  z-index: 1;
  background-color: white;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 40px;
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

const PageHeaderWrapper = styled.div`
  margin-left: 18px;
  margin-top: 25px;
  width: 300px;
`;

const TabListWrapperGeneral = styled.div`
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

const TabListWrapperAdvanced = styled.div`
  margin: 0 0 0 0px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.09px;
  color: #767676;
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

const defaultGeneralSettings = {
  default_pass_seconds: 0,
  default_wait_seconds: 0,
  down_pass_time_ratio_upper_limit: 0,
  down_pass_wait_seconds: 0,
  end_statistics_minutes_ago: 0,
  movie_resolution: 0,
  pass_time_ratio: 0,
  person_stay_report_interval_seconds: 0,
  sideroad_setting: 0,
  start_statistics_minutes_ago: 0,
  static_down_pass_seconds: 0,
  static_side1_pass_seconds: 0,
  static_side2_pass_seconds: 0,
  static_side3_pass_seconds: 0,
  static_side4_pass_seconds: 0,
  static_wait_seconds: 0,
  stop_state_change_seconds: 0,
  up_direction: 0,
  up_pass_time_ratio_upper_limit: 0,
  up_pass_wait_seconds: 0,
  static_up_pass_seconds: 0,
};

const defaultAdvancedSettings = {
  center_id: '',
  down_id: '',
  remote1_id: '',
  remote2_id: '',
  side1_id: '',
  side2_id: '',
  side3_id: '',
  side4_id: '',
  timesync_pass_seconds: '',
  timesync_side_pass_seconds: '',
  timesync_wait_seconds: '',
  up_id: '',
};

const defaultDataSet = {
  ...defaultGeneralSettings,
  ...defaultAdvancedSettings,
};

const CentralCameraSetting: React.FC<{}> = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const { t } = useTranslation(['CentralCameraSettings']);
  const history = useHistory();
  const [messageAlert, setMessageAlert] = useState<Alert | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showAdvance, setShowAdvance] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [generalSetting, setGeneralSettings] = useState(defaultGeneralSettings);
  const [advancedSetting, setAdvancedSetting] = useState(
    defaultAdvancedSettings
  );
  const [imgLoaded, setImgLoaded] = useState(false);
  const [settingSavedAlert, setSettingSavedAlert] = useState(false);
  const { createModal } = useModal();
  const [dataSet, setDataSet] = useState(defaultDataSet);
  const { centralCameraCtx, dispatchCentralCamera } = CentralCameraContext();
  const { cameraSettingsData } = centralCameraCtx;
  const isChecked =
    localStorage.getItem('center_advancedSetting_checked') &&
    JSON.parse(
      localStorage.getItem('center_advancedSetting_checked') || 'false'
    );
  const pageTitle = new URLSearchParams(window.location.search).get('tab');
  const [selectedTab, setSelectedTab] = useState(
    pageTitle ? pageTitle : 'general'
  );
  const curLang = localStorage.getItem('language') || 'en';
  const [currentLanguage, setCurrentLanguage] = useState<string>(curLang);
  const [isCancel, setIsCancel] = useState(false);
  const refIsCancel = useRef(isCancel);
  refIsCancel.current = isCancel;
  const [isRendered, setIsRendered] = useState(false);

  type LabelValue = {
    [key: string]: string;
  };

  const settingsLabel: LabelValue = {
    default_pass_seconds: t('defaultPassSeconds'),
    default_wait_seconds: t('defaultWaitSeconds'),
    down_pass_time_ratio_upper_limit: t('downPassTimeRatioUpperLimit'),
    down_pass_wait_seconds: t('downPassWaitSeconds'),
    end_statistics_minutes_ago: t('endStatisticsMinutesAgo'),
    movie_resolution: t('movieResolution'),
    pass_time_ratio: t('passTimeRatio'),
    person_stay_report_interval_seconds: t('personStayReportIntervalSeconds'),
    sideroad_setting: t('sideroadSetting'),
    start_statistics_minutes_ago: t('startStatisticsMinutes_ago'),
    static_down_pass_seconds: t('staticDownPassSeconds'),
    static_side1_pass_seconds: t('staticSide1PassSeconds'),
    static_side2_pass_seconds: t('staticSide2PassSeconds'),
    static_side3_pass_seconds: t('staticSide3PassSeconds'),
    static_side4_pass_seconds: t('staticSide4PassSeconds'),
    static_wait_seconds: t('staticWaitSeconds'),
    stop_state_change_seconds: t('stopStateChangeSeconds'),
    up_direction: t('upDirection'),
    up_pass_time_ratio_upper_limit: t('upperPassTimeRatioUpperLimit'),
    up_pass_wait_seconds: t('upPassWaitSeconds'),
    static_up_pass_seconds: t('staticUpPassSeconds'),
    center_id: t('centerId'),
    down_id: t('downId'),
    remote1_id: t('remote1Id'),
    remote2_id: t('remote2Id'),
    side1_id: t('side1Id'),
    side2_id: t('side2Id'),
    side3_id: t('side3Id'),
    side4_id: t('side4Id'),
    timesync_pass_seconds: t('timesyncPassSeconds'),
    timesync_side_pass_seconds: t('timesyncSidePassSeconds'),
    timesync_wait_seconds: t('timesyncWaitSeconds'),
    up_id: t('upId'),
  };

  const keepOnPage = useCallback((e) => {
    const message =
      'Warning!\n\nNavigating away from this page will discard unsaved changes.';
    e.preventDefault();
    e.returnValue = message;
    return message;
  }, []);

  useEffect(() => {
    setCurrentLanguage(curLang);
  }, [curLang]);

  useEffect(() => {
    if (unsavedChanges > 0) {
      window.addEventListener('beforeunload', keepOnPage);
    }
    return () => {
      window.removeEventListener('beforeunload', keepOnPage);
    };
  }, [unsavedChanges, keepOnPage]);

  useEffect(() => {
    setDataSet({
      ...cameraSettingsData?.advanced_setting,
      ...cameraSettingsData?.general_setting,
    });
    setAdvancedSetting({ ...cameraSettingsData?.advanced_setting });
    setGeneralSettings({ ...cameraSettingsData?.general_setting });
  }, [cameraSettingsData]);

  //for Unsaved Changes Count
  useEffect(() => {
    function difference(object: any, base: any) {
      return _.transform(object, (result: any, value: any, key: any) => {
        if (!_.isEqual(value.toString(), base[key].toString())) {
          result[key] =
            _.isObject(value) && _.isObject(base[key])
              ? difference(value, base[key])
              : value;
        }
      });
    }
    const modData = { ...generalSetting, ...advancedSetting };
    const diff = difference(dataSet, modData);
    setUnsavedChanges(Object.keys(diff).length);
  }, [generalSetting, advancedSetting, dataSet]);

  const handler = () => {
    const addPersonModal: ReactElement = (
      <ConfirmModal
        setShowAdvance={setShowAdvance}
        setSelected={setSelectedTab}
      />
    );
    const openConfirmationModal = () => {
      if (!isRendered) {

        if (!isChecked) {
          setIsRendered(true);
          createModal({
            isCloseEnable: false,
            customComponent: addPersonModal,
            dismissCallback: () => setSelectedTab('general'),
          });
        }
      }
    };
    if (selectedTab === 'advance') {
      openConfirmationModal();
    }
    CameraSettingService.getSettingsData().then((res) => {
      dispatchCentralCamera({
        type: 'GET_CAMERA_DATA',
        payload: res.data.data,
      });
    });

  };

  useEffect(handler, [dispatchCentralCamera, selectedTab, isChecked, createModal, isRendered]);

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
    CameraSettingService.getImage(true).then(
      (res) => {
        if (res.status === 200) {
          if (res.data) {
            setImgLoaded(true);
            let imageElement = document.getElementById(
              'cameraSnapshot'
            ) as HTMLImageElement;
            if (imageElement) {
              imageElement.src =
                'data:image/jpg;base64,' + arrayBufferToBase64(res.data);
            }
          }
        }
      },
      (err) => {
        setImgLoaded(false);
        console.log(err);
      }
    );
  }, 3000);

  const validateRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, min, max, title } = e.target;
    setMessageAlert(null);
    setTimeout(() => {
      if (!refIsCancel.current) {
        if (id === 'pass_time_ratio') {
          if (
            parseFloat(value) < parseFloat(min) ||
            parseFloat(value) > parseFloat(max) ||
            value.length === 0
          ) {
            const errorMessage = t('errorMessage1')
              .replace('{fieldLabel}', title)
              .replace('{min}', min)
              .replace('{max}', max);
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        }
        else if (id === 'side1_id') {
          if (value.length === 0 && generalSetting.sideroad_setting >= 1) {
            let orText = ' ' + t('or') + ' ';
            let errorMessage = t('errorMessage5')
              .replace('{fieldLabel}', title)
              .replace('{field}', t('sideroadSetting'))
              .replace(
                '{values}',
                t('upDownSideRoad1') +
                orText +
                t('upDownSideRoad1and2') +
                orText +
                t('upDownSideRoad123') +
                orText +
                t('upDownSideRoad1234')
              );
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        }
        else if (id === 'side2_id') {
          if (value.length === 0 && generalSetting.sideroad_setting >= 2) {
            let orText = ' ' + t('or') + ' ';
            let errorMessage = t('errorMessage5')
              .replace('{fieldLabel}', title)
              .replace('{field}', t('sideroadSetting'))
              .replace(
                '{values}',
                t('upDownSideRoad1') +
                orText +
                t('upDownSideRoad1and2') +
                orText +
                t('upDownSideRoad123') +
                orText +
                t('upDownSideRoad1234')
              );
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        }
        else if (id === 'side3_id') {
          if (value.length === 0 && generalSetting.sideroad_setting >= 3) {
            let orText = ' ' + t('or') + ' ';
            let errorMessage = t('errorMessage5')
              .replace('{fieldLabel}', title)
              .replace('{field}', t('sideroadSetting'))
              .replace(
                '{values}',
                t('upDownSideRoad1') +
                orText +
                t('upDownSideRoad1and2') +
                orText +
                t('upDownSideRoad123') +
                orText +
                t('upDownSideRoad1234')
              );
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        }
        else if (id === 'side4_id') {
          if (value.length === 0 && generalSetting.sideroad_setting >= 4) {
            let orText = ' ' + t('or') + ' ';
            let errorMessage = t('errorMessage5')
              .replace('{fieldLabel}', title)
              .replace('{field}', t('sideroadSetting'))
              .replace(
                '{values}',
                t('upDownSideRoad1') +
                orText +
                t('upDownSideRoad1and2') +
                orText +
                t('upDownSideRoad123') +
                orText +
                t('upDownSideRoad1234')
              );
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        }
        else if (id === 'center_id' || id === 'remote1_id' || id === 'remote2_id' || id === 'up_id' || id === 'down_id') {
          if (
            value.length > 16 ||
            value.length === 0
          ) {
            const errorMessage = t('errorMessage4')
              .replace('{fieldLabel}', title);
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        } else {
          if (
            parseInt(value) < parseInt(min) ||
            parseInt(value) > parseInt(max) ||
            value.length === 0
          ) {
            const errorMessage = t('errorMessage1')
              .replace('{fieldLabel}', title)
              .replace('{min}', min)
              .replace('{max}', max);
            setMessageAlert({
              key: new Date(),
              message: errorMessage,
              type: 'error',
            });
            const ele = document.getElementById(id);
            ele &&
              (ele.style.borderColor = 'red') &&
              ele.setAttribute('border-red', 'true');
          }
        }
      }
    }, 100);
    setIsCancel(false);

  };

  //save
  const onSave = async () => {
    setMessageAlert(null);
    for (const [key, value] of Object.entries({
      ...generalSetting,
      ...advancedSetting,
    })) {
      const errorMessage = validateInputs(
        JSON.stringify(value).replaceAll('"', ''),
        key,
        settingsLabel[key]
      );
      if (errorMessage) {
        setMessageAlert({
          key: new Date(),
          message: errorMessage,
          type: 'error',
        });
        const ele = document.getElementById(key);
        ele &&
          (ele.style.borderColor = 'red') &&
          ele.setAttribute('border-red', 'true');
        return;
      }
    }

    const payload = {
      advanced_setting: advancedSetting,
      general_setting: generalSetting,
    };
    setSaveLoading(true);
    CameraSettingService.putSettingsData(payload).then(
      (res) => {
        dispatchCentralCamera({
          type: 'PUT_CAMERA_DATA',
          payload: res.data.data,
        });
        setUnsavedChanges(0);
        setSettingSavedAlert(true);
        setSaveLoading(false);
        setIsReadOnly(true);
        const redBordered = document.querySelectorAll<HTMLElement>(
          'input[border-red="true"]'
        );
        for (const ele in redBordered) {
          if (parseInt(ele) <= redBordered.length - 1)
            redBordered[ele].style.borderColor = 'hsla(120,1.3%,85.3%,1.000)';
        }
        setTimeout(() => {
          setSettingSavedAlert(false);
        }, 3000);
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

  const validateInputs = (value: string, key: string, label: string) => {
    if (
      key === 'default_pass_seconds' ||
      key === 'static_up_pass_seconds' ||
      key === 'static_down_pass_seconds' ||
      key === 'static_side1_pass_seconds' ||
      key === 'static_side2_pass_seconds' ||
      key === 'static_side3_pass_seconds' ||
      key === 'static_side4_pass_seconds' ||
      key === 'timesync_pass_seconds' ||
      key === 'timesync_side_pass_seconds'
    ) {
      if (parseInt(value) >= 15 && parseInt(value) <= 3600) {
        return;
      } else {
        let errorMessage = t('errorMessage1')
          .replace('{fieldLabel}', label)
          .replace('{min}', '15')
          .replace('{max}', '3600');
        return errorMessage;
      }
    } else if (
      (key === 'default_wait_seconds' &&
        dataSet.default_wait_seconds !== parseInt(value)) ||
      (key === 'static_wait_seconds' &&
        dataSet.static_wait_seconds !== parseInt(value))
    ) {
      if (
        parseInt(value) >= 10 &&
        parseInt(value) <= 3600 &&
        parseInt(value) >= generalSetting?.up_pass_wait_seconds &&
        parseInt(value) >= generalSetting?.down_pass_wait_seconds
      ) {
        return;
      } else {
        let errorMessage = t('errorMessage2')
          .replace('{fieldLabel}', label)
          .replace('{min}', '10')
          .replace('{max}', '3600')
          .replace('{field1}', t('upPassWaitSeconds'))
          .replace('{field2}', t('downPassWaitSeconds'));
        return errorMessage;
      }
    } else if (key === 'timesync_wait_seconds') {
      if (parseInt(value) >= 10 && parseInt(value) <= 3600) {
        return;
      } else {
        let errorMessage = t('errorMessage1')
          .replace('{fieldLabel}', label)
          .replace('{min}', '10')
          .replace('{max}', '3600');
        return errorMessage;
      }
    } else if (
      key === 'down_pass_wait_seconds' &&
      dataSet.down_pass_wait_seconds !== parseInt(value)
    ) {
      if (
        parseInt(value) >= 5 &&
        parseInt(value) <= 3600 &&
        parseInt(value) <= generalSetting?.default_wait_seconds &&
        parseInt(value) <= generalSetting?.static_wait_seconds
      ) {
        return;
      } else {
        let errorMessage = t('errorMessage7')
          .replace('{fieldLabel}', label)
          .replace('{min}', '5')
          .replace('{max}', '3600')
          .replace('{field1}', t('defaultWaitSeconds'))
          .replace('{field2}', t('staticWaitSeconds'));
        return errorMessage;
      }
    } else if (
      key === 'up_pass_wait_seconds' && dataSet.up_pass_wait_seconds !== parseInt(value)
    ) {
      if (
        parseInt(value) >= 5 &&
        parseInt(value) <= 3600 &&
        parseInt(value) <= generalSetting?.default_wait_seconds &&
        parseInt(value) <= generalSetting?.static_wait_seconds
      ) {
        return;
      } else {
        let errorMessage = t('errorMessage7')
          .replace('{fieldLabel}', label)
          .replace('{min}', '5')
          .replace('{max}', '3600')
          .replace('{field1}', t('defaultWaitSeconds'))
          .replace('{field2}', t('staticWaitSeconds'));
        return errorMessage;
      }
    } else if (
      key === 'person_stay_report_interval_seconds'
    ) {
      if (parseInt(value) >= 5 && parseInt(value) <= 3600) {
        return;
      } else {
        let errorMessage = t('errorMessage1')
          .replace('{fieldLabel}', label)
          .replace('{min}', '5')
          .replace('{max}', '3600');
        return errorMessage;
      }
    } else if (key === 'stop_state_change_seconds') {
      if (parseInt(value) >= 15 && parseInt(value) <= 8640000) {
        return;
      } else {
        let errorMessage = t('errorMessage1')
          .replace('{fieldLabel}', label)
          .replace('{min}', '15')
          .replace('{max}', '8640000');
        return errorMessage;
      }
    } else if (
      key === 'up_pass_time_ratio_upper_limit' ||
      key === 'down_pass_time_ratio_upper_limit'
    ) {
      if (parseInt(value) >= 1 && parseInt(value) <= 100) {
        return;
      } else {
        let errorMessage = t('errorMessage1')
          .replace('{fieldLabel}', label)
          .replace('{min}', '1')
          .replace('{max}', '100');
        return errorMessage;
      }
    } else if (key === 'pass_time_ratio') {
      if (parseFloat(value) >= 0.1 && parseFloat(value) <= 1) {
        return;
      } else {
        let errorMessage = t('errorMessage1')
          .replace('{fieldLabel}', label)
          .replace('{min}', '0.1')
          .replace('{max}', '1');
        return errorMessage;
      }
    } else if (
      key === 'start_statistics_minutes_ago' &&
      dataSet.start_statistics_minutes_ago !== parseInt(value)
    ) {
      if (
        parseInt(value) >= 0 &&
        parseInt(value) <= 10080 &&
        parseInt(value) >= generalSetting?.end_statistics_minutes_ago
      ) {
        return;
      } else {
        let errorMessage = t('errorMessage3')
          .replace('{fieldLabel}', label)
          .replace('{min}', '0')
          .replace('{max}', '10080')
          .replace('{field}', t('endStatisticsMinutesAgo'));
        return errorMessage;
      }
    } else if (
      key === 'end_statistics_minutes_ago' &&
      dataSet.end_statistics_minutes_ago !== parseInt(value)
    ) {
      if (
        parseInt(value) >= 0 &&
        parseInt(value) <= 10080 &&
        parseInt(value) <= generalSetting?.start_statistics_minutes_ago
      ) {
        return;
      } else {
        let errorMessage = t('errorMessage6')
          .replace('{fieldLabel}', label)
          .replace('{min}', '0')
          .replace('{field}', t('startStatisticsMinutes_ago'))
          .replace('{max}', '10080');
        return errorMessage;
      }
    } else if (
      key === 'center_id' ||
      key === 'remote1_id' ||
      key === 'remote2_id' ||
      key === 'up_id' ||
      key === 'down_id'
    ) {
      if (value.length > 0 && value.length <= 16) {
        return;
      } else {
        let errorMessage = t('errorMessage4').replace('{fieldLabel}', label);
        return errorMessage;
      }
    } else if (key === 'side1_id') {
      if (generalSetting?.sideroad_setting < 1) {
        return;
      } else if (value.length === 0) {
        let orText = ' ' + t('or') + ' ';
        let errorMessage = t('errorMessage5')
          .replace('{fieldLabel}', label)
          .replace('{field}', t('sideroadSetting'))
          .replace(
            '{values}',
            t('upDownSideRoad1') +
            orText +
            t('upDownSideRoad1and2') +
            orText +
            t('upDownSideRoad123') +
            orText +
            t('upDownSideRoad1234')
          );
        return errorMessage;
      }
    } else if (key === 'side2_id') {
      if (generalSetting?.sideroad_setting < 2) {
        return;
      } else if (value.length === 0) {
        let orText = ' ' + t('or') + ' ';
        let errorMessage = t('errorMessage5')
          .replace('{fieldLabel}', label)
          .replace('{field}', t('sideroadSetting'))
          .replace(
            '{values}',
            t('upDownSideRoad1and2') +
            orText +
            t('upDownSideRoad123') +
            orText +
            t('upDownSideRoad1234')
          );
        return errorMessage;
      }
    } else if (key === 'side3_id') {
      if (generalSetting?.sideroad_setting < 3) {
        return;
      } else if (value.length === 0) {
        let orText = ' ' + t('or') + ' ';
        let errorMessage = t('errorMessage5')
          .replace('{fieldLabel}', label)
          .replace('{field}', t('sideroadSetting'))
          .replace(
            '{values}',
            t('upDownSideRoad123') + orText + t('upDownSideRoad1234')
          );
        return errorMessage;
      }
    } else if (key === 'side4_id') {
      if (generalSetting?.sideroad_setting < 4) {
        return;
      } else if (value.length === 0) {
        let errorMessage = t('errorMessage5')
          .replace('{fieldLabel}', label)
          .replace('{field}', t('sideroadSetting'))
          .replace('{values}', t('upDownSideRoad1234'));
        return errorMessage;
      }
    }
  };

  //Cancle
  const onCancel = () => {
    setIsCancel(true);
    setMessageAlert(null);
    setAdvancedSetting({ ...cameraSettingsData?.advanced_setting });
    setGeneralSettings({ ...cameraSettingsData?.general_setting });
    setUnsavedChanges(0);
    const redBordered = document.querySelectorAll<HTMLElement>(
      'input[border-red="true"]'
    );
    for (const ele in redBordered) {
      if (parseInt(ele) <= redBordered.length - 1)
        redBordered[ele].style.borderColor = 'hsla(120,1.3%,85.3%,1.000)';
    }
    setIsReadOnly(true);
  };

  // Edit Button
  const onEdit = () => {
    setIsReadOnly(false);
    setSaveLoading(false);
  };

  useEffect(() => {
    document.title = t('Common:pageTitle');
  }, [t]);

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
            title={t('Common:centralCamera')}
            areaHref='/'
            areaTitle={t('Common:cameraSystem')}
          />
        </PageHeaderWrapper>
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
              <UnSavedChangesText currentLanguage={currentLanguage}>{t('settingsSavedAlert')}</UnSavedChangesText>
            ) : null}
          </ButtonsWrapper>
        </ButtonSection>
      </PageHeaderContainer>
      <Tabs>
        <StickyContainer>
          <TabList defaultTabId={selectedTab}>
            <TabListWrapperGeneral
              onClick={() => {
                setSelectedTab('general');
                setIsRendered(false);
                history.push('/settings?tab=general');
              }}
            >
              <Tab tabFor='general'>{t('generalSettings')} </Tab>
            </TabListWrapperGeneral>
            <TabListWrapperAdvanced
              onClick={() => {
                history.push('/settings?tab=advance');
                setSelectedTab('advance');
              }}
            >
              <Tab tabFor='advance'>{t('advanced-WirelessSettings')}</Tab>
            </TabListWrapperAdvanced>
          </TabList>
          <Divider />
        </StickyContainer>
        <TabContent tabId='general'>
          <Tab1Container>
            <GeneralSetting
              generalSetting={generalSetting}
              setGeneralSettings={setGeneralSettings}
              messageAlert={messageAlert}
              setMessageAlert={setMessageAlert}
              isReadOnly={isReadOnly}
              validateRange={validateRange}
            />
          </Tab1Container>
        </TabContent>
        {(showAdvance || isChecked) && (
          <TabContent tabId='advance'>
            <Tab2Container>
              <AdvancedSetting
                advancedSetting={advancedSetting}
                setAdvancedSetting={setAdvancedSetting}
                setMessageAlert={setMessageAlert}
                messageAlert={messageAlert}
                isReadOnly={isReadOnly}
                sideRoadSetting={generalSetting?.sideroad_setting}
                validateRange={validateRange}
              />
            </Tab2Container>
          </TabContent>
        )}
      </Tabs>
    </Container>
  );
};

export default CentralCameraSetting;
