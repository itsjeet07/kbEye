import React from 'react';
import { SmallInput, SelectField, Spinner } from 'scorer-ui-kit';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Alert } from './CentralCamSetting';

const Container = styled.div`
  margin: 10px 20px 40px 20px;
  width: 100%;
  @media (min-width: 1024px) and (max-width: 1279px) {
    margin: 10px 20px 40px 10px;
    max-width: 1000px;
  }
`;

const TitleHeading = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.data};
  margin-top: 7px;
  font-size: 16px;
  font-weight: 500;
  color: #5a6269;
  margin-bottom: 22px;
`;

const PageInfo = styled.p`
  font-size: 14px;
  line-height: 1.79;
  letter-spacing: normal;
  color: #8b9196;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const LabelRow = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Label = styled.label`
  margin-left: 0px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  flex: 0 33%;
`;

const Input = styled(SmallInput)`
  font-family: ${({ theme }) => theme.fontFamily.data};
  height: 30px;
  [type='number'] {
    -moz-appearance: textfield;
  }
  flex: 0 33%;
  width: 241px;
`;

const SelectRow = styled.div`
  display: flex;
  height: 30px;
`;

interface isReadOnly {
  isReadOnly: boolean;
}

const SelectFieldCustom = styled(SelectField)<isReadOnly>`
  width: 230px;
  heigh: 30px;
  background: ${props => props.isReadOnly ? '' : 'rgb(255, 255, 255)'};
  font-style: normal !important;
  font-weight: 500 !important;
  color: hsla(207, 5%, 56.7%, 1) !important;
`;

const SelectFieldCustom1 = styled(SelectField) <isReadOnly>`
  width: 110px;
  heigh: 30px;
  background: ${props => props.isReadOnly ? '' : 'rgb(255, 255, 255)'};
  font-style: normal !important;
  font-weight: 500 !important;
  color: hsla(207, 5%, 56.7%, 1) !important;
`;

const SelectFieldContainer = styled.div`
  margin-left: 170px;
  @media (min-width: 1024px) and (max-width: 1279px) {
    margin-left: 105px;
  }
`;
const SelectFieldContainer1 = styled.div`
  margin-left: 287px;
  @media (min-width: 1024px) and (max-width: 1279px) {
    margin-left: 225px;
  }
`;

interface generalSettingsInterface {
  default_pass_seconds: number;
  default_wait_seconds: number;
  down_pass_wait_seconds: number;
  end_statistics_minutes_ago: number;
  movie_resolution: number;
  person_stay_report_interval_seconds: number;
  sideroad_setting: number;
  start_statistics_minutes_ago: number;
  static_down_pass_seconds: number;
  static_side1_pass_seconds: number;
  static_side2_pass_seconds: number;
  static_side3_pass_seconds: number;
  static_side4_pass_seconds: number;
  static_wait_seconds: number;
  stop_state_change_seconds: number;
  up_direction: number;
  up_pass_wait_seconds: number;
  pass_time_ratio: number;
  up_pass_time_ratio_upper_limit: number;
  down_pass_time_ratio_upper_limit: number;
  static_up_pass_seconds: number;
}

interface IAlert {
  key: Date;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}
interface Props {
  messageAlert: Alert | null;
  setMessageAlert: (data: IAlert | null) => void;
  generalSetting: generalSettingsInterface;
  setGeneralSettings: (key: generalSettingsInterface) => void;
  validateRange: (key: React.ChangeEvent<HTMLInputElement>) => void;
  isReadOnly: boolean;
}

const GeneralSetting: React.FC<Props> = ({
  generalSetting,
  setGeneralSettings,
  isReadOnly,
  validateRange,
}) => {
  const { t } = useTranslation(['CentralCameraSettings']);
  function handleChange<K extends keyof generalSettingsInterface>(
    key: K,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value, max } = e.target;
    if (key === 'start_statistics_minutes_ago' ||
      key === 'end_statistics_minutes_ago' ||
      key ==='pass_time_ratio') {
      // Do nothing
    } else {
      if (value.length > 0 && parseInt(value) === 0) {
        e.preventDefault();
        return;
      }
    }
    const ele = document.getElementById(key);
    ele && (ele.style.borderColor = 'hsla(120,1.3%,85.3%,1.000)');
    if (
      key === 'default_pass_seconds' ||
      key === 'default_wait_seconds' ||
      key === 'up_pass_wait_seconds' ||
      key === 'down_pass_wait_seconds' ||
      key === 'stop_state_change_seconds'
    ) {
      if (parseInt(value) > parseInt(max)) {
        e.preventDefault();
        return;
      }
      generalSetting[key] = parseInt(value);
    } else {
      if (
        key === 'pass_time_ratio' &&
        value.toString().length > e.target.maxLength
      ) {
        e.preventDefault();
        return;
      }
      if (parseFloat(value) > parseInt(max)) {
        e.preventDefault();
        return;
      }
      generalSetting[key] = parseFloat(value);
    }
    setGeneralSettings({ ...generalSetting });
  }

  function handleSelectChange<K extends keyof generalSettingsInterface>(
    key: K,
    e: string
  ) {
    generalSetting[key] = parseFloat(e);
    setGeneralSettings({ ...generalSetting });
  }

  return (
    <Container>
      {generalSetting === undefined ? (
        <div>
          <Spinner size='medium' styling='primary' />
        </div>
      ) : (
        <div>
          <TitleHeading id='title'>{t('titleGeneral')}</TitleHeading>
          <PageInfo>{t('descriptionGeneral')}</PageInfo>
          <LabelRow>
            <Label>{t('defaultPassSeconds')}</Label>
            <Label>{t('defaultWaitSeconds')}</Label>
            <Label>&nbsp;</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              label=''
              unit='sec'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              placeholder=''
              disabled={isReadOnly}
              id='default_pass_seconds'
              value={generalSetting?.default_pass_seconds}
              onChange={(e) => handleChange('default_pass_seconds', e)}
              min='15'
              max='3600'
              title={t('defaultPassSeconds')}
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              placeholder=''
              id='default_wait_seconds'
              title={t('defaultWaitSeconds')}
              disabled={isReadOnly}
              onChange={(e) => handleChange('default_wait_seconds', e)}
              value={generalSetting?.default_wait_seconds}
              min='10'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Label>&nbsp;</Label>
          </InputRow>
          <LabelRow>
            <Label>{t('upPassWaitSeconds')}</Label>
            <Label>{t('downPassWaitSeconds')}</Label>
            <Label>{t('stopStateChangeSeconds')}</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              id='up_pass_wait_seconds'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              title={t('upPassWaitSeconds')}
              onChange={(e) => handleChange('up_pass_wait_seconds', e)}
              value={generalSetting?.up_pass_wait_seconds}
              min='5'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              id='down_pass_wait_seconds'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              title={t('downPassWaitSeconds')}
              onChange={(e) => handleChange('down_pass_wait_seconds', e)}
              value={generalSetting?.down_pass_wait_seconds}
              min='5'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              id='stop_state_change_seconds'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              title={t('stopStateChangeSeconds')}
              onChange={(e) => handleChange('stop_state_change_seconds', e)}
              value={generalSetting?.stop_state_change_seconds}
              min='15'
              max='8640000'
              onBlur={(e) => validateRange(e)}
            />
          </InputRow>
          <LabelRow>
            <Label>{t('upperPassTimeRatioUpperLimit')}</Label>
            <Label>{t('downPassTimeRatioUpperLimit')}</Label>
            <Label>{t('passTimeRatio')}</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              step='1'
              label=''
              // unit='ratio'
              placeholder=''
              disabled={isReadOnly}
              id='upper_pass_time_ratio_upper_limit'
              title={t('upperPassTimeRatioUpperLimit')}
              onChange={(e) =>
                handleChange('up_pass_time_ratio_upper_limit', e)}
              value={generalSetting?.up_pass_time_ratio_upper_limit}
              min='1'
              max='100'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              step='1'
              label=''
              // unit='ratio'
              placeholder=''
              disabled={isReadOnly}
              id='down_pass_time_ratio_upper_limit'
              title={t('downPassTimeRatioUpperLimit')}
              onChange={(e) =>
                handleChange('down_pass_time_ratio_upper_limit', e)}
              value={generalSetting?.down_pass_time_ratio_upper_limit}
              min='1'
              max='100'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              step='0.1'
              label=''
              // unit='ratio'
              placeholder=''
              disabled={isReadOnly}
              id='pass_time_ratio'
              title={t('passTimeRatio')}
              onChange={(e) => handleChange('pass_time_ratio', e)}
              value={generalSetting?.pass_time_ratio}
              min='0.1'
              max='1'
              maxLength={3}
              onBlur={(e) => validateRange(e)}
            />
          </InputRow>
          <LabelRow>
            <Label>{t('startStatisticsMinutes_ago')}</Label>
            <Label>{t('endStatisticsMinutesAgo')}</Label>
            <Label>{t('personStayReportIntervalSeconds')}</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              label=''
              // unit='min'
              placeholder=''
              disabled={isReadOnly}
              id='start_statistics_minutes_ago'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              title={t('startStatisticsMinutes_ago')}
              onChange={(e) => handleChange('start_statistics_minutes_ago', e)}
              value={generalSetting?.start_statistics_minutes_ago}
              min='0'
              max='10080'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              // unit='min'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='end_statistics_minutes_ago'
              title={t('endStatisticsMinutesAgo')}
              onChange={(e) => handleChange('end_statistics_minutes_ago', e)}
              value={generalSetting?.end_statistics_minutes_ago}
              min='0'
              max='10080'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='person_stay_report_interval_seconds'
              title={t('personStayReportIntervalSeconds')}
              onChange={(e) =>
                handleChange('person_stay_report_interval_seconds', e)}
              value={generalSetting?.person_stay_report_interval_seconds}
              min='5'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
          </InputRow>
          <LabelRow>
            <Label>{t('upDirection')}</Label>
            <Label>{t('movieResolution')}</Label>
            <Label>{t('sideroadSetting')}</Label>
          </LabelRow>
          <SelectRow>
            <SelectFieldCustom
              isReadOnly={isReadOnly}
              label={t('upDirection')}
              isCompact
              disabled={isReadOnly}
              id='up_direction'
              title={t('upDirection')}
              value={
                JSON.stringify(generalSetting.up_direction)
              }
              changeCallback={(e) => handleSelectChange('up_direction', e)}
            >
              <option value='1'>{t('upRightUpdownLeftDown')}</option>
              <option value='2'>{t('upLeftUpdownRightDown')}</option>
              <option value='3'>{t('upRightBottomDownLeftTop')}</option>
              <option value='4'>{t('upLeftDowndownRightUp')}</option>
            </SelectFieldCustom>
            <SelectFieldContainer>
              <SelectFieldCustom1
                isReadOnly={isReadOnly}
                label={t('movieResolution')}
                isCompact
                disabled={isReadOnly}
                id='movie_resolution'
                title={t('movieResolution')}
                value={
                  generalSetting.movie_resolution
                }
                changeCallback={(e) =>
                  handleSelectChange('movie_resolution', e)}
              >
                <option value='1'>{t('big')}</option>
                <option value='2'>{t('small')}</option>
              </SelectFieldCustom1>
            </SelectFieldContainer>
            <SelectFieldContainer1>
              <SelectFieldCustom
                isReadOnly={isReadOnly}
                label={t('sideroadSetting')}
                isCompact
                disabled={isReadOnly}
                id='sideroad_setting'
                title={t('sideroadSetting')}
                value={JSON.stringify(generalSetting?.sideroad_setting)}
                changeCallback={(e) =>
                  handleSelectChange('sideroad_setting', e)}
              >
                <option value='0'>{t('upDown')}</option>
                <option value='1'>{t('upDownSideRoad1')}</option>
                <option value='2'>{t('upDownSideRoad1and2')}</option>
                <option value='3'>{t('upDownSideRoad123')}</option>
                <option value='4'>{t('upDownSideRoad1234')}</option>
              </SelectFieldCustom>
            </SelectFieldContainer1>
          </SelectRow>
          <LabelRow>
            <Label>{t('staticUpPassSeconds')}</Label>
            <Label>{t('staticDownPassSeconds')}</Label>
            <Label>&nbsp;</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='static_up_pass_seconds'
              title={t('staticUpPassSeconds')}
              onChange={(e) => handleChange('static_up_pass_seconds', e)}
              value={generalSetting?.static_up_pass_seconds}
              min='15'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              id='static_down_pass_seconds'
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              title={t('staticDownPassSeconds')}
              onChange={(e) => handleChange('static_down_pass_seconds', e)}
              value={generalSetting?.static_down_pass_seconds}
              min='15'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Label>&nbsp;</Label>
          </InputRow>
          <LabelRow>
            <Label>{t('staticSide1PassSeconds')}</Label>
            <Label>{t('staticSide2PassSeconds')}</Label>
            <Label>{t('staticSide3PassSeconds')}</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='static_side1_pass_seconds'
              title={t('staticSide1PassSeconds')}
              onChange={(e) => handleChange('static_side1_pass_seconds', e)}
              value={generalSetting?.static_side1_pass_seconds}
              min='15'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='static_side2_pass_seconds'
              title={t('staticSide2PassSeconds')}
              onChange={(e) => handleChange('static_side2_pass_seconds', e)}
              value={generalSetting?.static_side2_pass_seconds}
              min='15'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='static_side3_pass_seconds'
              title={t('staticSide3PassSeconds')}
              onChange={(e) => handleChange('static_side3_pass_seconds', e)}
              value={generalSetting?.static_side3_pass_seconds}
              min='15'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
          </InputRow>
          <LabelRow>
            <Label>{t('staticSide4PassSeconds')}</Label>
            <Label>{t('staticWaitSeconds')}</Label>
            <Label>&nbsp;</Label>
          </LabelRow>
          <InputRow>
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='static_side4_pass_seconds'
              title={t('staticSide4PassSeconds')}
              onChange={(e) => handleChange('static_side4_pass_seconds', e)}
              value={generalSetting?.static_side4_pass_seconds}
              min='15'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Input
              type='number'
              label=''
              unit='sec'
              placeholder=''
              disabled={isReadOnly}
              onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
              id='static_wait_seconds'
              title={t('staticWaitSeconds')}
              onChange={(e) => handleChange('static_wait_seconds', e)}
              value={generalSetting?.static_wait_seconds}
              min='10'
              max='3600'
              onBlur={(e) => validateRange(e)}
            />
            <Label>&nbsp;</Label>
          </InputRow>
        </div>
      )}
    </Container>
  );
};

export default GeneralSetting;
