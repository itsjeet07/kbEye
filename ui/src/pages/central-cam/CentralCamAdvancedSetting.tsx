import React from 'react';
import { SmallInput } from 'scorer-ui-kit';
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

const Input = styled(SmallInput)`
  font-family: ${({ theme }) => theme.fontFamily.data};
  height: 30px;
  [type='number'] {
    -moz-appearance: textfield;
  }
  flex: 0 33%;
`;

const TextFieldCustom = styled(SmallInput)`
  height: 30px;
  font-family: ${({ theme }) => theme.fontFamily.data};
  [type='text'] {
    -moz-appearance: textfield;
  }
  flex: 0 33%;
`;

const Label = styled.label`
  margin-left: 0px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  flex: 0 33%;
`;

interface advancedSettingsInterface {
  center_id: string;
  down_id: string;
  remote1_id: string;
  remote2_id: string;
  side1_id: string;
  side2_id: string;
  side3_id: string;
  side4_id: string;
  timesync_pass_seconds: string;
  timesync_side_pass_seconds: string;
  timesync_wait_seconds: string;
  up_id: string;
}
interface IAlert {
  key: Date;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}
interface Props {
  messageAlert: Alert | null;
  advancedSetting: advancedSettingsInterface;
  setAdvancedSetting: (key: advancedSettingsInterface) => void;
  setMessageAlert: (data: IAlert | null) => void;
  isReadOnly: boolean;
  sideRoadSetting: number;
  validateRange: (key: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdvancedSetting: React.FC<Props> = ({
  advancedSetting,
  setAdvancedSetting,
  isReadOnly,
  validateRange,
}) => {
  const { t } = useTranslation(['CentralCameraSettings']);

  function handleChange<K extends keyof advancedSettingsInterface>(
    key: K,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value, max } = e.target;
    if (
      key === 'timesync_pass_seconds' ||
      key === 'timesync_side_pass_seconds' ||
      key === 'timesync_wait_seconds'
    ) {
      if (value.length > 0 && parseInt(value) === 0) {
        e.preventDefault();
        return;
      }
    }
    const ele = document.getElementById(key);
    ele && (ele.style.borderColor = 'hsla(120,1.3%,85.3%,1.000)');
    if (parseInt(value) > parseInt(max)) {
      e.preventDefault();
      return;
    }
    advancedSetting[key] = value;
    setAdvancedSetting({ ...advancedSetting });
  }

  return (
    <Container>
      <TitleHeading id='title'>{t('titleAdvanced')}</TitleHeading>
      <PageInfo>{t('descriptionAdvanced')}</PageInfo>
      <LabelRow>
        <Label>{t('timesyncPassSeconds')}</Label>
        <Label>{t('timesyncSidePassSeconds')}</Label>
        <Label>{t('timesyncWaitSeconds')}</Label>
      </LabelRow>
      <InputRow>
        <Input
          type='number'
          label=''
          unit='sec'
          placeholder=''
          onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
          disabled={isReadOnly}
          id='timesync_pass_seconds'
          title={t('timesyncPassSeconds')}
          onChange={(e) => handleChange('timesync_pass_seconds', e)}
          value={advancedSetting?.timesync_pass_seconds}
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
          id='timesync_side_pass_seconds'
          title={t('timesyncSidePassSeconds')}
          value={advancedSetting?.timesync_side_pass_seconds}
          onChange={(e) => handleChange('timesync_side_pass_seconds', e)}
          min='15'
          max='3600'
          onBlur={(e) => validateRange(e)}
        />
        <Input
          type='number'
          label=''
          unit='sec'
          placeholder=''
          onKeyDown={(evt) => evt.key === '.' && evt.preventDefault()}
          disabled={isReadOnly}
          id='timesync_wait_seconds'
          title={t('timesyncWaitSeconds')}
          onChange={(e) => handleChange('timesync_wait_seconds', e)}
          value={advancedSetting?.timesync_wait_seconds}
          min='10'
          max='3600'
          onBlur={(e) => validateRange(e)}
        />
      </InputRow>
      <LabelRow>
        <Label>{t('centerId')}</Label>
        <Label>{t('remote1Id')}</Label>
        <Label>{t('remote2Id')}</Label>
      </LabelRow>
      <InputRow>
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='center_id'
          onChange={(e) => handleChange('center_id', e)}
          value={advancedSetting?.center_id}
          title={t('centerId')}
          onBlur={(e) => validateRange(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='remote1_id'
          onChange={(e) => handleChange('remote1_id', e)}
          value={advancedSetting?.remote1_id}
          title={t('remote1Id')}
          onBlur={(e) => validateRange(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='remote2_id'
          onChange={(e) => handleChange('remote2_id', e)}
          value={advancedSetting?.remote2_id}
          title={t('remote2Id')}
          onBlur={(e) => validateRange(e)}
        />
      </InputRow>
      <LabelRow>
        <Label>{t('upId')}</Label>
        <Label>{t('downId')}</Label>
        <Label>{t('side1Id')}</Label>
      </LabelRow>
      <InputRow>
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='up_id'
          onChange={(e) => handleChange('up_id', e)}
          value={advancedSetting?.up_id}
          title={t('upId')}
          onBlur={(e) => validateRange(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='down_id'
          onChange={(e) => handleChange('down_id', e)}
          value={advancedSetting?.down_id}
          title={t('downId')}
          onBlur={(e) => validateRange(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='side1_id'
          onChange={(e) => handleChange('side1_id', e)}
          value={advancedSetting?.side1_id}
          title={t('side1Id')}
          onBlur={(e) => validateRange(e)}
        />
      </InputRow>
      <LabelRow>
        <Label>{t('side2Id')}</Label>
        <Label>{t('side3Id')}</Label>
        <Label>{t('side4Id')}</Label>
      </LabelRow>
      <InputRow>
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='side2_id'
          onChange={(e) => handleChange('side2_id', e)}
          value={advancedSetting?.side2_id}
          title={t('side2Id')}
          onBlur={(e) => validateRange(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='side3_id'
          onChange={(e) => handleChange('side3_id', e)}
          value={advancedSetting?.side3_id}
          title={t('side3Id')}
          onBlur={(e) => validateRange(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='side4_id'
          onChange={(e) => handleChange('side4_id', e)}
          value={advancedSetting?.side4_id}
          title={t('side4Id')}
          onBlur={(e) => validateRange(e)}
        />
      </InputRow>
    </Container>
  );
};

export default AdvancedSetting;
