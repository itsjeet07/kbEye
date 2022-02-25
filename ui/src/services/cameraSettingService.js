import http from './httpService';
import { CENTER_API_BASE_URL, CENTER_SNAPSHOT_API_URL, CHILD_API_URL, CHILD_SNAPSHOT_API_URL, CHILD_API_ADVANCED_ACTION } from '../constants';

const CameraSettingService = {

  getImage: async (isThumbnail) => {
    const requestOptions = {
      responseType: 'arraybuffer'
    };
    if(isThumbnail){
      return await http.get(CENTER_SNAPSHOT_API_URL + '?width=auto&height=138&timestamp=' + Date.now(), requestOptions);
    } else {
      return await http.get(CENTER_SNAPSHOT_API_URL + '?timestamp=' + Date.now(), requestOptions);
    }
  },

  getChildImage: async (isThumbnail) => {
    const requestOptions = {
      responseType: 'arraybuffer'
    };
    if(isThumbnail){
      return await http.get(CHILD_SNAPSHOT_API_URL + '?width=auto&height=138&timestamp=' + Date.now(), requestOptions);
    } else {
      return await http.get(CHILD_SNAPSHOT_API_URL + '?timestamp=' + Date.now(), requestOptions);
    }
  },

  getSettingsData: async () => {
    let response = await http.get(CENTER_API_BASE_URL + 'setting');
    return response;
  },

  putSettingsData: async (payload) => {
    let response = await http.put(CENTER_API_BASE_URL + 'setting', payload);
    return response;
  },
  //
  getChildSettingsData: async () => {
    let response = await http.get(CHILD_API_URL + 'advanced-setting');
    return response;
  },

  putChildSettingsData: async (payload) => {
    let response = await http.put(CHILD_API_URL + 'advanced-setting', payload);
    return response;
  },

  getLineData: async () => {
    let response = await http.get(CENTER_API_BASE_URL + 'line');
    return response;
  },

  getChildLineData: async () => {
    let response = await http.get(CHILD_API_URL + 'line');
    return response;
  },

  putLineData: async (payload) => {
    let response = await http.put(CENTER_API_BASE_URL + 'line',payload);
    return response;
  },

  putChildLineData: async (payload) => {
    let response = await http.put(CHILD_API_URL + 'line',payload);
    return response;
  },

  postAdvancedAction: async (payload) => {
    let response = await http.post(CHILD_API_ADVANCED_ACTION, payload);
    return response;
  }
};

export default CameraSettingService;
