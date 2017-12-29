import React from 'react';
import { TextInput } from 'react-native';

const Input = props => (
  <TextInput
    placeholder={'Enter Time In Minutes'}
    keyboardType={'numeric'}
    style={{
      height: 40,
      width: 250,
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 15,
      padding: 10
    }}
    onChangeText={props.textChanged}
  />
);
export default Input;
