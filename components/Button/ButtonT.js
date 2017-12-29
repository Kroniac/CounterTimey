import React, { Component } from 'react';
import { Button } from 'react-native';

const ButtonT = props => (
  <Button
    title="Set Timer in Minutes"
    color="#42A5F5"
    onPress={props.setTimer}
    style={{
      borderRadius: 10,
      marginBottom: 10
    }}
  />
);

export default ButtonT;
