import React, { useEffect, useState } from 'react';
import { SelectField, SmallInput, useModal } from 'scorer-ui-kit';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ChildCamAdvancedConfirmModal from './ChildCamAdvancedConfirmModal';

const Container = styled.div`
  margin: 10px 20px 40px 20px;
  width: 100%;
  @media (min-width: 1024px) and (max-width: 1279px) {
    margin: 10px 20px 40px 10px;
    max-width: 1000px;
  }
`;

const SelectDiv = styled.div`
  padding: 0px 165px 0px 0px;
  @media (min-width: 1024px) and (max-width: 1279px) {
    padding: 0px 100px 0px 0px;
  }
`;

const TitleHeading = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.data};
  margin-top: -3px;
  font-size: 16px;
  font-weight: 500;
  color: #5a6269;
  margin-bottom: 22px;
`;

const TextContent = styled.p`
  font-size: 14px;
  line-height: 1.79;
  color: #8b9196;
`;

const Label = styled.label`
  margin-left: 0px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fontFamily.ui};
  flex: 0 33%;
`;

const LabelRow = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SelectFieldCustom = styled(SelectField)`
  width: 230px;
  heigh: 30px;
  background: white;
  font-style: normal !important;
  font-weight: 500 !important;
  color: hsla(207, 5%, 56.7%, 1) !important;
`;

const TextFieldCustom = styled(SmallInput)`
  height: 30px;
  font-family: ${({ theme }) => theme.fontFamily.data};
  [type='text'] {
    -moz-appearance: textfield;
  }
  flex: 0 33%;
  margin-left: 0px;
`;

interface advancedSettingsInterface {
  type: number;
  my_id: string;
  center_id: string;
}
interface advancedSettingsInterface1 {
  my_id: string;
  center_id: string;
}

interface advancedSettingsInterface2 {
  type: number;
}

interface IAlert {
  key: Date;
  message: string;
  type: 'error';
}

interface Props {
  advancedSetting: advancedSettingsInterface;
  setAdvancedSetting: (key: advancedSettingsInterface) => void;
  setMessageAlert: (data: IAlert | null) => void;
  isReadOnly: boolean;
}

const ChildAdvancedSetting: React.FC<Props> = ({
  advancedSetting,
  setAdvancedSetting,
  isReadOnly,
  setMessageAlert
}) => {
  const { t } = useTranslation(['ChildCameraSetting']);
  const { createModal } = useModal();
  const isChecked =
    localStorage.getItem('child_advancedSetting_checked') &&
    JSON.parse(
      localStorage.getItem('child_advancedSetting_checked') || 'false'
    );

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!isRendered) {
      const addPersonModal = <ChildCamAdvancedConfirmModal />;
      if (!isChecked) {
        setIsRendered(true);
        createModal({ isCloseEnable: false, customComponent: addPersonModal });
      }
    }
  }, [isChecked, createModal, isRendered]);

  function handleChange<K extends keyof advancedSettingsInterface1>(
    key: K,
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setMessageAlert(null);
    const ele = document.getElementById(key);
    ele && (ele.style.borderColor = 'hsla(120,1.3%,85.3%,1.000)');
    advancedSetting[key] = e.target.value;
    setAdvancedSetting({ ...advancedSetting });
  }

  function handleSelectChange<K extends keyof advancedSettingsInterface2>(
    key: K,
    e: string
  ) {
    advancedSetting[key] = parseInt(e);
    setAdvancedSetting({ ...advancedSetting });
  }

  const validateFeild = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id, } = e.target;
    setTimeout(() => {
      const isCancel = sessionStorage.getItem('isCancel');
      if (isCancel === 'false') {
        if (value.length < 1 || value.length > 16) {
          const ele = document.getElementById(id);
          ele && (ele.style.borderColor = 'red') && (ele.setAttribute('border-red', 'true'));
          const errorMessage = t('errorMessage1').replace('{fieldLabel}', t(id));
          setMessageAlert({
            key: new Date(),
            message: errorMessage,
            type: 'error',
          });
        }
      }
      sessionStorage.setItem('isCancel', 'false');
    }, 100);
  };

  return (
    <Container>
      <TitleHeading id='title'>{t('advanceTitle')}</TitleHeading>
      <TextContent>{t('advanceDescription')}</TextContent>
      <LabelRow>
        <Label>{t('type')}</Label>
        <Label>{t('my_id')}</Label>
        <Label>{t('center_id')}</Label>
      </LabelRow>
      <InputRow>
        <SelectDiv>
          <SelectFieldCustom
            label={t('type')}
            isCompact
            disabled={isReadOnly}
            name={t('type')}
            title={t('type')}
            value={JSON.stringify(advancedSetting.type)}
            changeCallback={(e) => handleSelectChange('type', e)}
          >
            <option value='1'>{t('down')}</option>
            <option value='2'>{t('up')}</option>
            <option value='3'>{t('sideRoad1')}</option>
            <option value='4'>{t('sideRoad2')}</option>
            <option value='5'>{t('sideRoad3')}</option>
            <option value='6'>{t('sideRoad4')}</option>
          </SelectFieldCustom>
        </SelectDiv>
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='my_id'
          onChange={(e) => handleChange('my_id', e)}
          value={advancedSetting?.my_id}
          title={t('my_id')}
          onBlur={(e) => validateFeild(e)}
        />
        <TextFieldCustom
          maxLength={16}
          type='text'
          label=''
          placeholder=''
          disabled={isReadOnly}
          id='center_id'
          onChange={(e) => handleChange('center_id', e)}
          value={advancedSetting?.center_id}
          title={t('center_id')}
          onBlur={(e) => validateFeild(e)}
        />
      </InputRow>
    </Container>
  );
};

export default ChildAdvancedSetting;
