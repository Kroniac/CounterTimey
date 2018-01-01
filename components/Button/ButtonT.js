import React, { Component } from 'react';
import { View, Button } from 'react-native';

const ButtonT = props => (
  <View style={{ marginBottom: 10 }}>
    <Button
      title={props.title}
      color="#42A5F5"
      onPress={props.setTimer}
      style={{
        borderRadius: 10
      }}
    />
  </View>
);

export default ButtonT;
