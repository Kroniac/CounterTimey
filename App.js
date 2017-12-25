import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Vibration,
  TextInput,
  Button,
  AppState
} from 'react-native';
import axios from 'axios';
import { Timer } from 'react-native-stopwatch-timer';
import PushControl from './components/PushControl';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import * as keys from './components/keys/key';
import audio from './assets/will_full.mp3';

let timex = 0;
let timerOut;
let whoosh = new Sound(audio);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      totalDuration: 0,
      timerReset: false,
      text: 0,
      act: true
    };

    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  toggleTimer() {
    if (timex !== 0 || this.state.timerStart) {
      if (!this.state.timerStart) {
        timerOut = BackgroundTimer.setTimeout(() => {
          let time = [];
          const location = 'Asia/Kolkata';
          const key = keys.timeApiKey;
          axios
            .get(
              `http://api.timezonedb.com/v2/get-time-zone?key=${key}&format=json&by=zone&zone=${location}`
            )
            .then(response => {
              time = response.data.formatted.split(' ');
              PushNotification.localNotification({
                title: 'Current Internet IST',
                message: time[1] + ' ' + response.data.abbreviation,
                color: 'red',
                vibrate: true,
                vibration: 10000
              });
              if (AppState.currentState === 'active') {
                alert(time[1] + ' ' + response.data.abbreviation);
              }
            })
            .catch(e => {
              PushNotification.localNotification({
                title: "Couldn't fetch Current IST",
                message: e.toString(),
                color: 'red',
                vibrate: true,
                vibration: 10000
              });
            });
          PushNotification.localNotification({
            title: 'TIMEOUT',
            message: 'Counter TimerOut',
            color: 'red',
            vibrate: true,
            vibration: 10000
          });
          whoosh.play(success => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }, timex);
      } else {
        BackgroundTimer.clearTimeout(timerOut);
      }
      this.setState({ act: !this.state.act });
      this.setState({ timerStart: !this.state.timerStart, timerReset: false });
    } else alert('Set some time please');
  }

  resetTimer() {
    this.setState({ timerStart: false, timerReset: true });
    BackgroundTimer.clearTimeout(timerOut);
  }

  getFormattedTime(time) {
    this.currentTime = time;
    timex = Number(time.split(':').join(''));
  }

  setTimer = () => {
    if (this.state.text !== 0) {
      this.resetTimer();
      let time = this.state.text * 60000;
      this.setState({ totalDuration: time });
    } else alert('Set some time please');
  };
  render() {
    let timeInput = this.state.act ? (
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
        onChangeText={text => this.setState({ text: text })}
      />
    ) : null;

    let button = this.state.act ? (
      <Button
        title="Set Timer in Minutes"
        color="#42A5F5"
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
        {timeInput}
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
    padding: 20,
    borderRadius: 5,
    width: 250,
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
