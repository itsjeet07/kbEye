import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import Common_en from './locales/en/Common.json';
import CentralCameraMain_en from './locales/en/CentralCameraMain.json';
import CentralCameraSettings_en from './locales/en/CentralCameraSettings.json';
import ChildCameraSetting_en from "./locales/en/ChildCameraSetting.json";

import Common_ja from './locales/ja/Common.json';
import CentralCameraMain_ja from './locales/ja/CentralCameraMain.json';
import CentralCameraSettings_ja from './locales/ja/CentralCameraSettings.json';
import ChildCameraSetting_ja from "./locales/ja/ChildCameraSetting.json";


const resources = {
  en: {
    Common: Common_en,
    CentralCameraMain: CentralCameraMain_en,
    CentralCameraSettings: CentralCameraSettings_en,
    ChildCameraSetting:ChildCameraSetting_en,
  },
  ja: {
    Common: Common_ja,
    CentralCameraMain: CentralCameraMain_ja,
    CentralCameraSettings: CentralCameraSettings_ja,
    ChildCameraSetting:ChildCameraSetting_ja,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja',
    lng: localStorage.getItem('language') || navigator.language,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    defaultNS: 'Common',
    ns: ['Common', 'CentralCameraMain', 'CentralCameraSettings', "ChildCameraSetting"]
  });

export default i18n;
