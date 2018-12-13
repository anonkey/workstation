import React from 'react';

import CountBadge from '../CountBadge';

import * as Ui from './Ui';

export default class Github extends React.PureComponent {
  render() {
    const { data, onPress } = this.props;
    return (React.Children.toArray([
      <Ui.CountBadgeContainer>
        {
          data.notificatonCount ?
            <CountBadge number={data.notificatonCount} />
          : null
        }
      </Ui.CountBadgeContainer>,
      <Ui.Container
      onPress={onPress}
      >
      <Ui.Icon
      source={{
        uri: data.icon,
      }}
      />
      </Ui.Container>,
    ]));
  }
}
