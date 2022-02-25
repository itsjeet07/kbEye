import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './i18n';
import Fonts from './Fonts';
import Style from './style';
import { ThemeProvider } from 'styled-components';
import { lightTheme, ModalProvider, NotificationProvider, } from 'scorer-ui-kit';
import {CentralCameraProvider} from './store/centralCameraSettingStore';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <ModalProvider>
        <NotificationProvider>
          <CentralCameraProvider>
            <App />
            <Fonts />
            <Style />
          </CentralCameraProvider>
        </NotificationProvider>
      </ModalProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
