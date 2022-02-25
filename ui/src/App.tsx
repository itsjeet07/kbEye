import React, { useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import i18n from 'i18next';
import { Layout } from 'scorer-ui-kit';
import styled from 'styled-components';
import CentralCamSetting from './pages/central-cam/CentralCamSetting';
import CentralCamMain from './pages/central-cam/CentralCamMain';
import ChildCameraMain from './pages/child-cam/ChildCameraMain';
import ChildCameraSetting from './pages/child-cam/ChildCameraSetting';
import { NODE_TYPE } from './constants';

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const LanguageSelect = styled.select`
  position: fixed;
  right: 80px;
  bottom: 1%;
`;

const App = () => {
  const onLanguageChange = useCallback(() => {
    const language = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, []);

  return (
    <Router>
      <Layout>
        <MainContainer>
          {/* <TopBar
            loggedInUser=''
            onLanguageToggle={onLanguageChange}
            hasLogout={false}
            hasLanguage
          /> */}

          {NODE_TYPE === 'Center' ? (
            <Switch>
              <Route path='/' exact component={CentralCamMain} />
              <Route path='/settings' exact component={CentralCamSetting} />
            </Switch>
          ) : NODE_TYPE === 'Child' ? (
            <Switch>
              <Route path='/' exact component={ChildCameraMain} />
              <Route path='/settings' exact component={ChildCameraSetting} />
            </Switch>
          ) : (
            ''
          )}
        </MainContainer>
      </Layout>
      {i18n.language === 'ja' ? (
        <LanguageSelect onChange={onLanguageChange} defaultValue='ja'>
          <option value='ja'>日本語</option>
          <option value='en'>English</option>
        </LanguageSelect>
      ) : (
        <LanguageSelect onChange={onLanguageChange} defaultValue='en'>
          <option value='ja'>日本語</option>
          <option value='en'>English</option>
        </LanguageSelect>
      )}
    </Router>
  );
};

export default App;
