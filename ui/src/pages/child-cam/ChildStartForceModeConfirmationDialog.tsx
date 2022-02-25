import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, resetButtonStyles, useModal, ModalProvider, Icon } from 'scorer-ui-kit';

const StyledButton = styled.button`
  ${resetButtonStyles};
  color: hsl(0, 0%, 65%);
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: italic;
  line-height: 1.79;
  color: hsl(0, 0%, 65%);
  display: block;
  margin-right: 10px;
`;

const BackButton = styled(Button)`
  margin-right: 10px;
`;

const ButtonGroup = styled.div`
  text-align: end;
  // margin-top: 10px;
  margin-left: 113px;
  ${StyledButton} {
    margin: 15px auto 0 auto;
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: hsl(210, 6%, 47%);
`;

const CardContent = styled.div`
  //   padding: 30px 40px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.79;
  letter-spacing: normal;
  color: hsl(200, 1%, 49%);
  p {
    margin: 1.4rem 0;
  }
`;

const CardModal = styled.div`
  display: flex;
  flex-direction: column;
`;
const Check = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContainerCheck = styled.div`
  width: 160px;
  display: flex;
  padding-top: 10px;
`;

const IconWrapper = styled.div<{ color: string }>`
  [stroke] {
    stroke: ${({ theme, color }) => theme.colors.icons[color]};
  }
`;

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
  ${({ selected = false }) =>
    selected &&
    css`
      border-bottom: 5px solid hsl(207, 80%, 64%);
    `}
  &:focus {
    outline: none;
  }

  &:hover:enabled {
    ${({ theme }) =>
    theme &&
      css`
        opacity: 0.8;
        transition: transform ${theme.animation.speed.normal} ${theme.animation.easing.primary.inOut};
      `}
  }
  &:active:enabled {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.1;
  }
`;

const CloseIcon = styled(Icon)``;

const ConfirmModalStartForceMode = (props?: any) => {
  const { t } = useTranslation(['ChildCameraSetting','common']);
  const { setModalOpen } = useModal();
  const { handler } = props;

  const submit = () => {
    handler();
    setModalOpen(false);
  };

  return (
    <ModalProvider>
      <CardModal>
        <CloseButton
          onClick={() => {
            setModalOpen(false);
          }}
        >
          {t('close')}
          <CloseIcon icon='CloseCompact' size={15} color='dimmed' weight='heavy' />
        </CloseButton>
        <CardContent>
          <CardTitle>{t('childwarningTitle')}</CardTitle>
          <p>{t('childwarningDescription')}</p>
          <Check>
            <ContainerCheck />
            <ButtonGroup>
              <BackButton
                design='secondary'
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                {t('back')}
              </BackButton>
              <Button design='primary' onClick={submit}>
                {t('understand')}
              </Button>
            </ButtonGroup>
          </Check>
        </CardContent>
      </CardModal>
    </ModalProvider>
  );
};

export default ConfirmModalStartForceMode;
