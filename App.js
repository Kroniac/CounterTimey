import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Vibration,
  TextInput,
  Button,
  AppState
} from 'react-native';

import { Timer } from 'react-native-stopwatch-timer';

let timex = 0;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      totalDuration: 9000,
      timerReset: false,
      text: 0,
      act: true
    };

    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  toggleTimer() {
    if (timex !== 0 || this.state.timerStart) {
      this.setState({ act: !this.state.act });
      this.setState({ timerStart: !this.state.timerStart, timerReset: false });
    } else alert('Set some time please');
  }

  resetTimer() {
    this.setState({ timerStart: false, timerReset: true });
  }

  getFormattedTime(time) {
    this.currentTime = time;
  }
  setTimer = () => {
    if (this.state.text !== 0) {
      this.resetTimer();
      let time = this.state.text * 60000;
      this.setState({ totalDuration: time });
    } else alert('Set some time please');
  };
  render() {
    let inputBox = this.state.act ? (
      <TextInput
        placeholder={'0'}
        keyboardType={'numeric'}
        style={{
          height: 40,
          width: 200,
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 15
        }}
        onChangeText={text => this.setState({ text: text })}
      />
    ) : null;

    let button = this.state.act ? (
      <Button
        title="Set Timer in Minutes"
        onPress={this.setTimer}
        style={{
          borderRadius: 10,
          marginBottom: 10
        }}
      />
    ) : null;
    return (
      <View style={styles.container}>
        <Timer
          totalDuration={this.state.totalDuration}
          msecs
          start={this.state.timerStart}
          reset={this.state.timerReset}
          options={options}
          handleFinish={handleTimerComplete}
          getTime={this.getFormattedTime}
        />
        {inputBox}
        {button}
        <TouchableHighlight onPress={this.toggleTimer}>
          <Text style={{ fontSize: 45 }}>
            {!this.state.timerStart ? 'Start' : 'Stop'}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const handleTimerComplete = () => {
  reset = () => {
    this.resetTimer();
    this.state.text = 0;
    this.state.totalDuration = 0;
  };
};

const options = {
  container: {
    backgroundColor: '#42A5F5',
    padding: 10,
    borderRadius: 5,
    width: 220,
    marginBottom: 40
  },
  text: {
    fontSize: 32,
    color: '#FFF',
    marginLeft: 7
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
