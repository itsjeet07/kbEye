// export const MAX_LOG_COUNT = process.env.REACT_APP_MAX_DETECTION_LOGS ? process.env.REACT_APP_MAX_DETECTION_LOGS : 10;
// export const NODE_TYPE = process.env.REACT_APP_NODE_TYPE ? process.env.REACT_APP_NODE_TYPE : 'Center';  //Center, Child
// const CENTER_HOST = window.location.hostname;
// const CENTER_SERVER_URL = window.location.protocol + '//' + CENTER_HOST;
// export const CENTER_API_BASE_URL = CENTER_SERVER_URL + '/api/v1/';
// export const CENTER_SNAPSHOT_API_URL = CENTER_SERVER_URL + ':20001/api/v1/stacks/' + process.env.REACT_APP_STACK_NAME + '/snapshot';
// export const CENTER_WEBRTC_URL = 'ws://' + CENTER_HOST + ':20001/' + process.env.REACT_APP_WEBRTC_URI + '/';
// export const CENTER_WS_ENDPOINT_3300 = CENTER_SERVER_URL + ':3300/log-frame';
// export const CENTER_WS_ENDPOINT_3301 = CENTER_SERVER_URL + ':3301/log-frame';

// const CHILD_HOST = window.location.hostname;
// const CHILD_SERVER_URL =  window.location.protocol + '//' +CHILD_HOST ;
// export const CHILD_API_URL = CHILD_SERVER_URL + '/api/v1/';
// export const CHILD_SNAPSHOT_API_URL = CHILD_SERVER_URL + ':20001/api/v1/stacks/' + process.env.REACT_APP_STACK_NAME + '/snapshot';
// export const CHILD_WS_ENDPOINT_3300 = CHILD_SERVER_URL + ':3300/log-frame';
// export const CHILD_WEBRTC_URL = 'ws://' + CHILD_HOST + ':20001/' + process.env.REACT_APP_WEBRTC_URI + '/'
// export const CHILD_API_ADVANCED_ACTION = CHILD_SERVER_URL + '/timesync-api';



export let NODE_TYPE = "Child";  //Center, Child
export const MAX_LOG_COUNT = 10;
const CENTER_HOST = '192.168.30.12';
const CENTER_SERVER_URL = 'http://' + CENTER_HOST;
export const CENTER_API_BASE_URL = CENTER_SERVER_URL + ':5000/api/v1/';
export const CENTER_SNAPSHOT_API_URL = CENTER_SERVER_URL + ':20001/api/v1/stacks/RTSPcam1/snapshot';
export const CENTER_WEBRTC_URL = 'ws://' + CENTER_HOST + ':20001/webrtc-23001/';
export const CENTER_WS_ENDPOINT_3300 = CENTER_SERVER_URL + ':3300/log-frame';
export const CENTER_WS_ENDPOINT_3301 = CENTER_SERVER_URL + ':3301/log-frame';

const CHILD_HOST = '192.168.30.16';
const CHILD_SERVER_URL =  window.location.protocol + '//' +CHILD_HOST ;
export const CHILD_API_URL = CHILD_SERVER_URL + ':5000/api/v1/';
export const CHILD_SNAPSHOT_API_URL = CHILD_SERVER_URL + ':20001/api/v1/stacks/RTSPcam1/snapshot';
export const CHILD_WS_ENDPOINT_3300 = CHILD_SERVER_URL + ':3300/log-frame';
export const CHILD_WEBRTC_URL = 'ws://' + CHILD_HOST + ':20001/webrtc-23001/'
export const CHILD_API_ADVANCED_ACTION = CHILD_SERVER_URL + ':6001/api/timesync';
