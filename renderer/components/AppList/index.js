import React from 'react';
import PropTypes from 'prop-types';

import { ipcRenderer } from 'electron';
import {
  Easing,
  Animated,
} from 'react-native';

import Folder from '../Folder';
import AppItem from '../AppItem';

import * as Ui from './Ui';

export default class AppList extends React.PureComponent {

  static PropTypes = {
    onPressApp: PropTypes.func,
  }

  static defaultProps = {
    onPressApp: () => 0,
  }

  static ItemTypes = {
    default: AppItem,
    Folder,
  }

  state = {
    left: new Animated.Value(-60),
  }

  componentDidMount() {
    this.win = require('electron').remote.getCurrentWindow();
    this.winBounds = this.win.getBounds();
  }

  onPressGenerator = item => () => this.props.onPressApp(item);

  renderItem = ({ item }) => {
    const Component = AppList.ItemTypes[item.type || 'default']
    return (
      <Component data={item}
        onPress={this.onPressGenerator(item)}
      />
    );
  }

  onMouseEnter = () => {
    this.animate();
    this.win.setSize(100, this.winBounds.height);
    this.win.setContentSize(100, this.winBounds.height);
  }

  onMouseLeave = () => {
    this.animate(-100, () => {
      this.win.setSize(1, this.winBounds.height);
      this.win.setContentSize(1, this.winBounds.height);
    });
  }

  animate = (toValue = 0, callback) => {
    Animated.timing(
      this.state.left, {
        toValue,
        duration: 242,
        ease: Easing.elastic,
      },
    ).start(callback);
  }

  render() {
    return (
      <Ui.Container
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
      >
        <Animated.View
          style={{
            left: this.state.left,
          }}
        >
        <Ui.List
          data={this.props.apps}
          contentContainerStyle={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
          }}
          renderItem={this.renderItem}
        />
        </Animated.View>
      </Ui.Container>
    )
  }
};
