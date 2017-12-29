import React from 'react';
import { TouchableHighlight, Text } from 'react-native';

const TouchableHighlightT = props => (
  <TouchableHighlight onPress={props.toggleTimer}>
    <Text style={{ fontSize: 45 }}>{props.timeStart}</Text>
  </TouchableHighlight>
);

export default TouchableHighlightT;
