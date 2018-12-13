import React from 'react';

import * as Ui from './Ui';

const CountBadge = ({ number, className }) => (
  <Ui.View className={className}>
    <Ui.Text>{number}</Ui.Text>
  </Ui.View>
);

export default CountBadge;
