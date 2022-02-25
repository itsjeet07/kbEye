import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 114px;
`;

const InfoLabel = styled.div`
  margin-top: 31px;
  font-size: 14px;
  color: #a3a6a9;
`;

const InfoValue = styled.div`
  margin-top: 11px;
  color: #8b9196;
  font-size: 16px;
  font-weight: 600;
`;

const LineInfo: React.FC<any> = ({ infoLabel, infoValue}) => {
  return (
    <InfoContainer>
      <InfoLabel>{infoLabel}</InfoLabel>
      <InfoValue>{infoValue}</InfoValue>
    </InfoContainer>
  );
};

export default LineInfo;