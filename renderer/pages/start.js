import React from 'react';
import { View, Text } from 'react-native';
import { ipcRenderer } from 'electron';

import AppList from '../components/AppList';
import PageWrapper from '../components/PageWrapper';

import config from '../config';

export default class Start extends React.PureComponent {
  state = {
    config: null,
  }

  componentDidMount() {
    config().then((data) => {
      this.setState({
        config: data,
      });
    });
    // setTimeout(() => {
    //   new Notification('test');
    // }, 400);
    ipcRenderer.on('notification', (e, notification) => {
      const notificationHostname = new URL(notification.from).hostname;
      console.log('Notification HOST NAME ! ', notificationHostname);
      const apps = this.state.config.apps.map((app) => {
        const appHostname = new URL(app.url).hostname;
        console.log(appHostname);
        if (appHostname === notificationHostname) {
          if (!app.notificatonCount) app.notificatonCount = 0;
          app.notificatonCount += 1;
        }
        return { ...app };
      });
      this.setState({
        config: {
          ...this.state.config,
          apps,
        }
      }, () => {
        console.log(this.state);
      });
      console.log('main page got notification ! !! ! !', notification);
    });
  }

  openApp = (appToOpen) => {
    ipcRenderer.send('openApp', appToOpen);
    const apps = this.state.config.apps.map((app) => {
      if (app.url === appToOpen.url) {
        app.notificatonCount = 0;
      }
      return {...app};
    });
    this.setState({
      config: {
        ...this.state.config,
        apps,
      },
    });
  }

  render = () => (
    <PageWrapper>
      {this.state.config ?
        <AppList
          onPressApp={this.openApp}
          apps={this.state.config.apps}
        />
      : null}
    </PageWrapper>
  )
}
