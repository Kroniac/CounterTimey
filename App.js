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
    this.setState({ timerStart: !this.state.timerStart, timerReset: false });
  }

  resetTimer() {
    this.setState({ timerStart: false, timerReset: true });
  }

  getFormattedTime(time) {
    this.currentTime = time;
  }

  render() {
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
        <TouchableHighlight onPress={this.toggleTimer}>
          <Text style={{ fontSize: 45 }}>
            {!this.state.timerStart ? 'Start' : 'Stop'}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}


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
