import React from 'react';

import AppItem from '../AppItem';

import * as Ui from './Ui';

// TODO folder animation and extention

export default class Folder extends React.PureComponent {
  state = {
    open: false,
  }

  componentDidMount() {
  }

  render() {
    return (
      <Ui.Container>
        <AppItem
          {...this.props}
        />
      </Ui.Container>
    );
  }
}
