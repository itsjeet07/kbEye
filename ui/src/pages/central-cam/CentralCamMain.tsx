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
  ButtonWithLoading,
  AlertBar,
} from 'scorer-ui-kit';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CameraSettingService from '../../services/cameraSettingService';
import { useReducer } from 'react';
import { io } from 'socket.io-client';
import {
  CENTER_WS_ENDPOINT_3300,
  CENTER_WS_ENDPOINT_3301,
  MAX_LOG_COUNT,
  CENTER_WEBRTC_URL,
} from '../../constants';
import StatusInfo from '../../components/StatusInfo';
import LineInfo from '../../components/LineInfo';
import { Alert } from './CentralCamSetting';

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
  @media (min-width: 1024px) and (max-width: 1151px) {
    width: 340px;
    padding: 0 40px;
  }
  @media (min-width: 1152px) and (max-width: 1279px) {
    width: 370px;
    padding: 0 50px;
  }
`;

const LogoContainer = styled.div`
  margin-left: -19px;
  margin-top: 40px;
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

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
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

const LineUIImageContainer = styled.div<Ivideo>`
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

const LineUIVideoContainer = styled.div<Ivideo>`
  width: 770px;
  height:443px !important;
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

const StatusText = styled.label`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: normal;
  color: #5a6269;
  margin-bottom: 21px;
`;

const VerticalLine = styled.div`
  height: 1px;
  width: 268px;
  margin: 9px 0px 10px 0;
  background-color: #eee;
`;

const TimeText = styled.label`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: normal;
  color: #5a6269;
  margin-bottom: 21px;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const LineInfoContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  @media (min-width: 1152px) and (max-width: 1279px) {
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

const CentralCameraMain: React.FC<{}> = () => {
  const { t } = useTranslation(['CentralCameraMain', 'Common']);
  const history = useHistory();
  const [isEdit, setIsEdit] = useState(false);
  const [state, dispatch] = useReducer(LineReducer, []);
  const [img, setImg] = useState('');
  const [imgHeight, setImgHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isVideoExpired, setIsVideoExpired] = useState(false);
  const socket0 = useRef<any>();
  const socket1 = useRef<any>();
  const [messageAlert, setMessageAlert] = useState<Alert | null>(null);
  const [cameraStatus, setCameraStatus] = useState({
    current_mode: '',
    current_state: '',
    next_change_state_sec: 0,
    stop_change_sec: 0,
    up_pass_seconds: 0,
    down_pass_seconds: 0,
    up_pass_count: 0,
    down_pass_count: 0,
    stream_id: '',
    frame_time: 0,
  });
  const refVideoLoaded = useRef(videoLoaded);
  refVideoLoaded.current = videoLoaded;
  const [isMobile, setIsMobile] = useState(false);
  interface IDetection {
    detection: string;
    frame_time: string;
    stream_id: string;
  }

  const [detectionLog, setDetectionLog] = useState<any>([]);
  const detectionLogRef = useRef<any>();
  detectionLogRef.current = detectionLog;

  useEffect(() => {
    socket1.current = io(CENTER_WS_ENDPOINT_3301);
    socket1.current.on('connect', () => {
      console.info('socket connected for status');
    });

    //on message
    socket1.current.on('message', (data: any) => {
      setCameraStatus(data);
    });

    socket1.current.on('error', (err: any) => {
      console.info('socket error for status', err);
    });

    socket1.current.on('disconnect', (reason: any) => {
      console.info('socket disconnected for status:', reason);
    });

    return () => {
      if (socket1.current) socket1.current.close();
    };
  }, []);

  useEffect(() => {
    socket0.current = io(CENTER_WS_ENDPOINT_3300);
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
      let data: any = { 'detection': Date.now() + ': car  : left - tracking_id: 1631217257.80733_000000', 'frame_time': 1631217259.4147232, 'stream_id': 'detection' };
      if (detectionLogRef.current.length < MAX_LOG_COUNT) {
        setDetectionLog([ ...detectionLogRef.current, data ]);
      } else {
        detectionLogRef.current.shift();
        setDetectionLog([ ...detectionLogRef.current, data ]);
      }
    }, 3000);
  }, []);*/

  useEffect(() => {
    const isMobile = (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    if (isMobile) {
      setIsMobile(true);
      setVideoLoaded(true);
      setIsVideoExpired(true);
    }
    getLineData();
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
  }, [t]);

  const getLineData = () => {
    CameraSettingService.getLineData().then((res) => {
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

  const redirectToCentral = () => {
    history.push('/settings?tab=general');
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
      CameraSettingService.getImage(false).then(
        (res) => {
          if (res.status === 200) {
            if (res.data) {
              const imgBase64 =
                'data:image/jpg;base64,' + arrayBufferToBase64(res.data);
              setImg(imgBase64);
              const newImg = new Image();

              newImg.onload = function () {
                setImgHeight(newImg.height);
                setImgWidth(newImg.width);
                setImgLoaded(true);
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
    setSaveLoading(true);
    const dataCordinates = stateRef.current;
    const data = {
      x1: dataCordinates[0]?.points[0].x,
      y1: dataCordinates[0]?.points[0].y,
      x2: dataCordinates[0]?.points[1].x,
      y2: dataCordinates[0]?.points[1].y,
    };

    CameraSettingService.putLineData(data).then(
      (res) => {
        dispatch({
          type: 'LOAD',
          state: setCordinates(res),
        });
        setIsEdit(false);
        setSaveLoading(false);
      },
      (err) => {
        setSaveLoading(false);
        console.log('errr of put line', err);
      }
    );
  };

  const videoLoadedHandler = () => {
    setVideoLoaded(true);
  };

  useEffect(() => {
    document.title = t('Common:pageTitle');
  }, [t]);

  return (
    <PageContainer>
      <LeftContainer>
        <LogoContainer>
          <LogoImage src='./Images/KBEye logo.png' />
        </LogoContainer>
        <PageHeaderContainer>
          <PageHeader
            title={t('Common:centralCamera')}
            areaHref='/'
            areaTitle={t('Common:cameraSystem')}
          />
        </PageHeaderContainer>
        <StatusContainer>
          <StatusText> {t('status')}</StatusText>
          <StatusInfo
            stausLabel={t('currentMode')}
            statusValue={cameraStatus?.current_mode?.trim()}
          />
          <VerticalLine />
          <StatusInfo
            stausLabel={t('currentState')}
            statusValue={cameraStatus?.current_state?.trim()}
          />
          <VerticalLine />
          <StatusInfo
            stausLabel={t('nextChangeStateSec')}
            statusValue={cameraStatus.next_change_state_sec}
          />
          <VerticalLine />
          <StatusInfo
            stausLabel={t('stopChangeSec')}
            statusValue={cameraStatus.stop_change_sec}
          />
        </StatusContainer>
        <TimeContainer>
          <TimeText> {t('timing')}</TimeText>
          <StatusInfo
            stausLabel={t('upPassSec')}
            statusValue={cameraStatus.up_pass_seconds}
          />
          <VerticalLine />
          <StatusInfo
            stausLabel={t('downPassSec')}
            statusValue={cameraStatus.down_pass_seconds}
          />
          <VerticalLine />
          <StatusInfo
            stausLabel={t('upPassCount')}
            statusValue={cameraStatus.up_pass_count}
          />
          <VerticalLine />
          <StatusInfo
            stausLabel={t('downPassCount')}
            statusValue={cameraStatus.down_pass_count}
          />
        </TimeContainer>
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
              <ButtonWithLoading
                loading={saveLoading}
                design='primary'
                onClick={save}
              >
                {t('Common:save')}
              </ButtonWithLoading>
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
                onClick={redirectToCentral}
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
                  ws={CENTER_WEBRTC_URL}
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

export default CentralCameraMain;
