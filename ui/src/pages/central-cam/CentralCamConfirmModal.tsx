import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  useModal,
  ModalProvider,
  Checkbox,
  Label,
  Icon
} from 'scorer-ui-kit';

const CardModal = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContent = styled.div`
  width: 510px;
  height: 208px;
`;

const CardTitle = styled.div`
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  font-family: ${({ theme }) => theme.fontFamily.ui};
  font-size: 20px;
  font-weight: 500;
  color: #727980;
`;

const CardDescription = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.79;
  color: #7c7e7f;
  margin-top: 28px;
  height: 75px;
`;

const BottomContainer = styled.div`
  display: flex;
  height: 50px;
`;

const ContainerCheck = styled.div`
  width: 160px;
  display: flex;
  margin-top: 57px;
`;

const CheckboxLabel = styled(Label)`
  margin-left: 12px;
  margin-top: 2px;
`;

const BackButton = styled(Button)`
  margin-right: 10px;
`;

const ButtonGroup = styled.div`
  margin-left: 117px;
  margin-top: 48px;
`;

const resetButtonStyles = css`
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
  user-select: none;
`;

const IconWrapper = styled.div<{ color: string }>`
[stroke]{
  stroke: ${({ theme, color }) => theme.colors.icons[color]};
}
`;

const CloseIcon = styled(Icon)``;

const CloseButton = styled.button<{ selected?: boolean }>`
  ${resetButtonStyles};
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: -30px;
  color: ${({ theme }) => theme.colors.icons.dimmed};
  font-size: 14px;
  font-weight: 500;
  ${IconWrapper} {
    display: flex;
    margin-right: 13px;
  }
  ${({ selected = false }) => selected && css`
    border-bottom: 5px solid hsl(207, 80%, 64%);
  `}
  &:focus {
    outline: none;
  }
 
  &:hover:enabled {
    ${({ theme }) => theme && css`
      opacity: .8;
      transition: transform ${theme.animation.speed.normal} ${theme.animation.easing.primary.inOut};
    `}
  }
  &:active:enabled {
    opacity: .9;
  }
  &:disabled {
    opacity: 0.1;
  }
`;

const CentralCameraConfirmationModal = (props?: any) => {
  const { t } = useTranslation(['CentralCameraSettings']);
  const { setModalOpen } = useModal();
  const { setShowAdvance, setSelected } = props;
  const [isChecked, setIsChecked] = useState(false);

  const submit = () => {
    setModalOpen(false);
    setShowAdvance(true);
    if (isChecked) {
      localStorage.setItem('center_advancedSetting_checked', JSON.stringify(isChecked));
    }
  };

  return (
    <ModalProvider>
      <CardModal>
        <CloseButton onClick={() => {
          setModalOpen(false);
          setSelected('general');
        }}
        >
          {t('close')}
          <CloseIcon icon='CloseCompact' size={15} color='dimmed' weight='heavy' />
        </CloseButton>
        <CardContent>
          <CardTitle>{t('warningTitle')}</CardTitle>
          <CardDescription>{t('warningDescription')}</CardDescription>
          <BottomContainer>
            <ContainerCheck>
              <Checkbox checked={isChecked} onChangeCallback={() => setIsChecked(!isChecked)} />
              <CheckboxLabel labelText={t('doNotShowAgain')} htmlFor='checkbox' onClick={() => setIsChecked(!isChecked)} />
            </ContainerCheck>
            <ButtonGroup>
              <BackButton
                design='secondary'
                onClick={() => {
                  setModalOpen(false);
                  setSelected('general');
                }}
              >{t('Common:back')}
              </BackButton>
              <Button
                design='primary'
                onClick={submit}
              >{t('Common:iUnderstand')}
              </Button>
            </ButtonGroup>
          </BottomContainer>
        </CardContent>
      </CardModal>
    </ModalProvider>
  );
};

export default CentralCameraConfirmationModal;