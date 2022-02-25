import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  font-size: 14px;
  color: #8b9196;
  width: 264px;
  flex-flow: column wrap;
  align-content: space-between;
  height: 20px;
`;

const StatusLabel = styled.div`
  height: 20px;
`;

const StatusValue = styled.div`
  height: 20px;
`;

const StatusInfo: React.FC<any> = ({ stausLabel, statusValue}) => {

  return (
    <StatusContainer>
      <StatusLabel>{stausLabel} </StatusLabel>
      <StatusValue>{statusValue}</StatusValue>
    </StatusContainer>
  );
};

export default StatusInfo;
