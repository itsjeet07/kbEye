import React, { createContext, useContext, useReducer } from 'react';

const centralCameraContext = createContext(null);

const initialVal = {
  cameraSettingsData: [],
  lineData: [],
  childCameraSettingsData: [],
  advancedAction: []
};

const reducer = (state, action) => {
  switch (action.type) {
  case 'GET_CAMERA_DATA': {
    return {
      ...state,
      cameraSettingsData: action.payload,
    };
  }
  case 'PUT_CAMERA_DATA': {
    return {
      ...state,
      cameraSettingsData: action.payload,
    };
  }
  case 'ON_CANCEL': {
    return {
      ...state,
      cameraSettingsData: state.cameraSettingsData,
    };
  }
  case 'GET_LINE_DATA': {
    return {
      ...state,
      lineData: action.payload,
    };
  }
  case 'PUT_LINE_DATA': {
    return {
      ...state,
      lineData: action.payload,
    };
  }
  case 'GET_CHILD_CAM_DATA':{
    return {
      ...state,
      childCameraSettingsData: action.payload,
    };
  }
  case 'POST_ADVANCED_ACTION':{
    return {
      ...state,
      advancedAction : action.payload,
    };
  }
  default:
    return state;
  }
};

export const CentralCameraProvider = (props) => {
  const [centralCameraCtx, dispatchCentralCamera] = useReducer(
    reducer,
    initialVal
  );

  return (
    <centralCameraContext.Provider
      value={{ centralCameraCtx, dispatchCentralCamera }}
      {...props}
    />
  );
};

export const CentralCameraContext = () => {
  const context = useContext(centralCameraContext);
  if (!context) {
    throw new Error('Please use the context inside parent scope');
  }
  return context;
};
