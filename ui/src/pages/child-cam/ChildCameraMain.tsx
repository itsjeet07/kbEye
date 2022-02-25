import React, { useState, useEffect, useRef } from 'react';
import {
  PageHeader,
  Button,
  usePoll,
  LineUI,
  LineUIRTC,
  LineReducer,
  LineSetContext,
  ButtonWithIcon,
  Spinner,
  AlertBar,
} from 'scorer-ui-kit';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CameraSettingService from '../../services/cameraSettingService';
import { useReducer } from 'react';
import { io } from 'socket.io-client';
import {
  MAX_LOG_COUNT,
  CHILD_WS_ENDPOINT_3300,
  CHILD_WEBRTC_URL,
} from '../../constants';
import LineInfo from '../../components/LineInfo';
import { CentralCameraContext } from '../../store/centralCameraSettingStore';
import { Alert } from './ChildCameraSetting';

interface IButton {
  isEdit: boolean;
}

interface Ivideo {
  showVideo: boolean;
}

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  @media (min-width: 1024px) and (max-width: 1279px) {
    justify-content: left;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  padding-left: 61px;
  padding-right: 61px;
  margin-top: 319px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    width: 325px;
    padding: 0 40px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    width: 370px;
    padding: 0 50px;
  }
`;

const LogoContainer = styled.div`
  margin-left: -19px;
  width: 120px;
  height: 30px;
`;

const LogoImage = styled.img`
  width: auto;
  height: auto;
`;

const PageHeaderContainer = styled.div`
  margin-top: 54px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  padding-left: 60px;
  border-left: 1px solid #eee;
  height: 100%;
  @media (min-width: 1024px) and (max-width: 1151px) {
    padding-left: 40px;
    margin-left: 0;
    padding-right: 10px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    padding-left: 50px;
    margin-left: 0;
    padding-right: 20px;
  }
`;

export const LineUIImageContainer = styled.div<Ivideo>`
  width: 770px;
  z-index: ${(props) => (props.showVideo ? '0' : '100')};
  position: absolute;
  left: 0px;
  top: 0px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    width: 625px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    width: 665px;
  }
`;

export const LineUIVideoContainer = styled.div<Ivideo>`
  width: 770px;
  z-index: ${(props) => (props.showVideo ? '100' : '0')};
  position: absolute;
  left: 0px;
  top: 0px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    width: 625px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    width: 665px;
  }
`;
interface isImage {
  imgLoaded: boolean;
}
const LineUIWarpper = styled.div<isImage>`
  position: relative;
  height: ${props => props.imgLoaded ? '433px' : '385px'};
  @media (min-width: 1024px) and (max-width: 1279px) {
    height: 350px;
  }
`;

const ButtonSection = styled.div<IButton>`
  display: flex;
  justify-content: space-between;
  height: 74px;
  margin-top: 85px;
  width: 770px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    width: 625px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    width: 665px;
  }
`;

const ButtonsWrapper = styled.div`
  margin-top: 5px;
  margin-bottom: 29px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const DetectionLog = styled.div`
  display: flex;
  flex-direction: column;
  height: 310px;
  background-color: #f6f6f6;
  margin-top: 50px;
  margin-bottom: 40px;
  padding-left: 20px;
  padding-right: 57px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const DetectionLogText = styled.label`
  height: 16px;
  margin-top: 21px;
  margin-bottom: 18px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 14px;
  font-weight: 600;
  color: #8b9196;
`;

const DetectionLogWarpper = styled.div`
  position: relative;
  @media (min-width: 1024px) and (max-width: 1159px) {
    width: 625px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin-top: 50px;
    width: 665px;
  }
`;

const DetectionList = styled.div`
  width: 693px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 14px;
`;

const Log = styled.div`
  margin-top: 8px;
`;

const LineInfoContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin-top: 10px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin-top: 30px;
  }
`;

const HorizontalLine = styled.div`
  height: 40px;
  width: 1px;
  margin: 31px 39px 0 35px;
  background-color: #eee;
`;

const EditText = styled.div`
  height: 24px;
  margin-top: 13px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 20px;
  font-weight: 500;
  color: #5a6269;
`;

const EditButton = styled(ButtonWithIcon)`
  margin-right: 10px;
`;

const CancelButton = styled(Button)`
  margin-right: 10px;
`;

const SpinnerContainer = styled.div`
  padding: 12px 24px;
  width: 100px;
  border-radius: 3px;
  margin: 15% auto;
  display: flex;
  justify-content: center;
  align-items: center;
  styling: 'primary';
`;

const VideoLoadingContainer = styled.div`
  display: flex;
  height: 40px;
  margin: 6px 304px 28px 0px;
  padding: 11px 14px 13px 10px;
  border-radius: 3px;
  border: solid 1px #eee;
  @media (min-width: 1024px) and (max-width: 1151px) {
    margin: 6px 30px 28px 0px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    margin: 6px 30px 28px 0px;
  }
`;

const VideoLoadingLabel = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 14px;
  color: #8b9196;
  margin: 2px 0 0 10px;
`;

const AlertContainer = styled.div`
  display: flex;
  max-height: 30px;
  margin: 0px 30px 28px 0px;
  padding: 0px 14px 13px 10px;
  @media (min-width: 1024px) and (max-width: 1279px) {
    margin: 0px 30px 28px 0px;
  }
`;

const ChildCameraMain: React.FC<{}> = () => {
  const { t } = useTranslation(['ChildCameraSetting', 'Common']);
  const history = useHistory();
  const [isEdit, setIsEdit] = useState(false);
  const [state, dispatch] = useReducer(LineReducer, []);
  const [img, setImg] = useState('');
  const [imgHeight, setImgHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [messageAlert, setMessageAlert] = useState<Alert | null>(null);
  const [isVideoExpired, setIsVideoExpired] = useState(false);
  const socket0 = useRef<any>();
  const { centralCameraCtx, dispatchCentralCamera } = CentralCameraContext();
  const { childCameraSettingsData } = centralCameraCtx;
  const refVideoLoaded = useRef(videoLoaded);
  refVideoLoaded.current = videoLoaded;
  const [isMobile, setIsMobile] = useState(false);
  const [detectionLog, setDetectionLog] = useState<any>([]);
  const detectionLogRef = useRef<any>();
  detectionLogRef.current = detectionLog;

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
  interface IDetection {
    detection: string;
    frame_time: string;
    stream_id: string;
  }

  useEffect(() => {
    socket0.current = io(CHILD_WS_ENDPOINT_3300);
    socket0.current.on('connect', () => {
      console.info('socket connected for detection log');
    });

    //on message
    socket0.current.on('message', (data: any) => {
      // Keep detection log of MAX_LOG_COUNT only. If size exceed then remove previous log
      if (detectionLogRef.current.length < MAX_LOG_COUNT) {
        setDetectionLog([ ...detectionLogRef.current, data ]);
      } else {
        detectionLogRef.current.shift();
        setDetectionLog([ ...detectionLogRef.current, data ]);
      }
    });

    socket0.current.on('error', (err: any) => {
      console.info('socket error for detection log', err);
    });

    socket0.current.on('disconnect', (reason: any) => {
      console.info('socket disconnected for detection log:', reason);
    });

    return () => {
      if (socket0.current) socket0.current.close();
    };
  }, []);

  /*useEffect(() => {
    const interval = setInterval(function () {
      let data: any = { 'detection': Date.now() + ': car  : left - tracking_id: 1631217257.80733_000000', 'frame_time': Date.now(), 'stream_id': 'detection' };
      if (detectionLogRef.current.length < MAX_LOG_COUNT) {
        setDetectionLog([ ...detectionLogRef.current, data ]);
      } else {
        detectionLogRef.current.shift();
        setDetectionLog([ ...detectionLogRef.current, data ]);
      }
    }, 3000);
  }, []);*/

  useEffect(() => {
    const isMobileDevice = (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    if (isMobileDevice) {
      setIsMobile(true);
      setVideoLoaded(true);
      setIsVideoExpired(true);
    }
    
    CameraSettingService.getChildSettingsData().then((res) => {
      dispatchCentralCamera({
        type: 'GET_CHILD_CAM_DATA',
        payload: res.data.data,
      });
    });
    setTimeout(() => {
      if (!refVideoLoaded.current) {
        setIsVideoExpired(true);
        setMessageAlert({
          key: new Date(),
          message: t('videoLoadingError'),
          type: 'error',
        });
      }
    }, 30000);
  }, [dispatchCentralCamera, t]);

  useEffect(() => {
    getLineData();
  }, []);

  const getLineData = () => {
    CameraSettingService.getChildLineData().then((res) => {
      const x = [
        {
          points: [
            {
              x: res.data.data.x1,
              y: res.data.data.y1,
            },
            {
              x: res.data.data.x2,
              y: res.data.data.y2,
            },
          ],
          readOnly: false,
          styling: 'primary',
        },
      ];
      dispatch({
        type: 'LOAD',
        state: x,
      });
    });
  };

  const setCordinates = (res: any) => {
    const dataSet = [
      {
        points: [
          {
            x: res.data.data.x1,
            y: res.data.data.y1,
          },
          {
            x: res.data.data.x2,
            y: res.data.data.y2,
          },
        ],
        readOnly: false,
        styling: 'primary',
      },
    ];
    return dataSet;
  };

  const stateRef = useRef(state);
  stateRef.current = state;
  const options = {
    showHandleFinder: false,
    showSetIndex: false,
    showPointLabel: false,
    showHandle: false,
    showGrabHandle: isEdit,
  };

  const redirectToChildSettings = () => {
    history.push('/settings?tab=advance');
  };

  const onLineMoveEnd = () => {
    const data = stateRef.current;
    dispatch({
      type: 'LOAD',
      state: data,
    });
  };

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
    if (!videoLoaded || isMobile)
      CameraSettingService.getChildImage(false).then(
        (res) => {
          if (res.status === 200) {
            if (res.data) {
              const imgBase64 =
                'data:image/jpg;base64,' + arrayBufferToBase64(res.data);
              setImg(imgBase64);
              const newImg = new Image();

              setImgLoaded(true);
              newImg.onload = function () {
                setImgHeight(newImg.height);
                setImgWidth(newImg.width);
              };
              newImg.src = imgBase64;
            }
          }
        },
        (err) => {
          setImgLoaded(false);
          console.log(err);
        }
      );
  }, 3000);

  const save = () => {
    const dataCordinates = stateRef.current;
    const data = {
      x1: dataCordinates[0]?.points[0].x,
      y1: dataCordinates[0]?.points[0].y,
      x2: dataCordinates[0]?.points[1].x,
      y2: dataCordinates[0]?.points[1].y,
    };

    CameraSettingService.putChildLineData(data).then(
      (res) => {
        dispatch({
          type: 'LOAD',
          state: setCordinates(res),
        });
        setIsEdit(false);
      },
      (err) => {
        console.log('errr of put line', err);
      }
    );
  };

  const videoLoadedHandler = () => {
    setVideoLoaded(true);
  };

  return (
    <PageContainer>
      <LeftContainer>
        <LogoContainer>
          <LogoImage src='./Images/KBEye logo.png' />
        </LogoContainer>
        <PageHeaderContainer>
          <PageHeader
            title={
              childCameraSettingsData?.type === 1
                ? t('down') + ' ' + t('camera')
                : childCameraSettingsData?.type === 2
                  ? t('up') + ' ' + t('camera')
                  : childCameraSettingsData?.type === 3
                    ? t('sideRoad1') + ' ' + t('camera')
                    : childCameraSettingsData?.type === 4
                      ? t('sideRoad2') + ' ' + t('camera')
                      : childCameraSettingsData?.type === 5
                        ? t('sideRoad3') + ' ' + t('camera')
                        : childCameraSettingsData?.type === 6
                          ? t('sideRoad4') + ' ' + t('camera')
                          : t('Common:childCamera')
            }
            areaHref='/'
            areaTitle={t('Common:cameraSystem')}
          />
        </PageHeaderContainer>
      </LeftContainer>
      <ContentContainer>
        {isEdit ? (
          <ButtonSection isEdit={isEdit}>
            <EditText>{t('editLine')}</EditText>
            <ButtonsWrapper>
              <CancelButton
                design='secondary'
                size='normal'
                onClick={() => {
                  setIsEdit(false);
                  getLineData();
                }}
              >
                {t('Common:cancel')}
              </CancelButton>
              <Button design='primary' onClick={save}>
                {t('Common:save')}
              </Button>
            </ButtonsWrapper>
          </ButtonSection>
        ) : (
          <ButtonSection isEdit={isEdit}>
            {videoLoaded ? (
              <div />
            ) : isVideoExpired ? (
              <AlertContainer>
                {messageAlert && (
                  <AlertBar
                    key={messageAlert.key}
                    type={messageAlert.type}
                    message={messageAlert.message}
                  />
                )}
              </AlertContainer>
            ) : (
              <VideoLoadingContainer>
                <Spinner size='small' styling='primary' />
                <VideoLoadingLabel>{t('videoLoading')}</VideoLoadingLabel>
              </VideoLoadingContainer>
            )}
            <ButtonsWrapper>
              <EditButton
                design='secondary'
                size='normal'
                icon='FeatureLineUi'
                position='left'
                onClick={() => setIsEdit(true)}
              >
                {t('editLine')}
              </EditButton>
              <ButtonWithIcon
                design='secondary'
                size='normal'
                icon='ViewSettings'
                position='left'
                onClick={redirectToChildSettings}
              >
                {t('Common:settings')}
              </ButtonWithIcon>
            </ButtonsWrapper>
          </ButtonSection>
        )}

        <LineUIWarpper imgLoaded={imgLoaded}>
          <LineSetContext.Provider value={{ state, dispatch }}>
            {imgLoaded ? (
              <LineUIImageContainer showVideo={videoLoaded}>
                <LineUI
                  onLineMoveEnd={() => onLineMoveEnd()}
                  src={img}
                  options={options}
                />
              </LineUIImageContainer>
            ) : (
              <SpinnerContainer />
            )}

            {isVideoExpired ? (
              ''
            ) : (
              <LineUIVideoContainer showVideo={videoLoaded}>
                <LineUIRTC
                  options={options}
                  ws={CHILD_WEBRTC_URL}
                  onLoaded={() => {
                    videoLoadedHandler();
                  }}
                />
              </LineUIVideoContainer>
            )}
          </LineSetContext.Provider>
        </LineUIWarpper>

        {isEdit ? (
          <LineInfoContainer>
            <LineInfo
              infoLabel={t('imageResolution')}
              infoValue={`${imgWidth} x ${imgHeight} `}
            />
            <HorizontalLine />
            <LineInfo
              infoLabel={t('lineStart')}
              infoValue={
                'X: ' +
                stateRef.current[0]?.points[0].x +
                ' Y: ' +
                stateRef.current[0]?.points[0].y
              }
            />
            <HorizontalLine />
            <LineInfo
              infoLabel={t('lineEnd')}
              infoValue={
                'X: ' +
                stateRef.current[0]?.points[1].x +
                ' Y: ' +
                stateRef.current[0]?.points[1].y
              }
            />
          </LineInfoContainer>
        ) : (
          <DetectionLogWarpper>
            <DetectionLog>
              <DetectionLogText>{t('detectionLogs')}</DetectionLogText>
              <DetectionList>
                {Object.keys(detectionLog).map((index: any) => {
                  return (
                    <Log key={detectionLog[index].frame_time}>
                      {detectionLog[index].detection}
                    </Log>
                  );
                })}
              </DetectionList>
            </DetectionLog>
          </DetectionLogWarpper>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default ChildCameraMain;
