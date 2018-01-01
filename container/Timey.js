import React, { Component } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import Btn from '../components/Button/ButtonT';
import Input from '../components/Textinput/Input';
import axios from 'axios';
import PushControl from '../components/PushControl';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import * as keys from '../components/keys/key';
import audio from '../assets/will_full.mp3';

//id for background task
let intervalId;
let whoosh = new Sound(audio);

class Timey extends Component {
  state = {
    displayTime: '0d 0h 0m 0s',
    remTime: 0,
    inputTime: 0,
    showStartButton: true
  };

  //to set time on the clock
  setTimer = () => {
    let time = this.state.inputTime;
    if (time > 0) {
      time = time * 60000;
      let days = Math.floor(time / (1000 * 60 * 60 * 24));
      let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((time % (1000 * 60)) / 1000);
      let displayTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      this.setState({ displayTime: displayTime, remTime: time });
    } else alert('Set Correct Time');
  };

  //to start the timer
  startTimer = () => {
    if (this.state.remTime > 0) {
      this.setState({ showStartButton: false });
      // Start a timer that runs continuous after X milliseconds
      intervalId = BackgroundTimer.setInterval(() => {
        let time = this.state.remTime - 1000;
        let days = Math.floor(time / (1000 * 60 * 60 * 24));
        let hours = Math.floor(
          (time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((time % (1000 * 60)) / 1000);
        let displayTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        this.setState({ displayTime: displayTime, remTime: time });
        if (time < 0) {
          BackgroundTimer.clearInterval(intervalId);
          this.setState({
            showStartButton: true,
            displayTime: '0d 0h 0m 0s',
            remTime: 0
          });
          this.notify();
        }
      }, 1000);
    } else alert('Set Some Time Please To start');
  };

  //to stop or pause the timer
  stopTimer = () => {
    BackgroundTimer.clearInterval(intervalId);
    this.setState({
      showStartButton: true
    });
  };

  //to show nofication at timer completed
  notify = () => {
    let time = [];
    const location = 'Asia/Kolkata';
    const key = keys.timeApiKey;
    //get request to get IST time from TimezoneDB API
    axios
      .get(
        `http://api.timezonedb.com/v2/get-time-zone?key=${key}&format=json&by=zone&zone=${location}`
      )
      .then(response => {
        //if success then display time
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
        //if not found show error message
        PushNotification.localNotification({
          title: "Couldn't fetch Current IST",
          message: e.toString(),
          color: 'red',
          vibrate: true,
          vibration: 10000
        });
      });
    //push notification for indicating timeout
    PushNotification.localNotification({
      title: 'TIMEOUT',
      message: 'Counter TimerOut',
      color: 'red',
      vibrate: true,
      vibration: 10000
    });
    //to play sound
    whoosh.play();
  };
  //rendering components
  render() {
    let button = this.state.showStartButton ? (
      <Btn setTimer={this.startTimer} title="START TIMER" />
    ) : (
      <Btn setTimer={this.stopTimer} title="PAUSE TIMER" />
    );
    let setTimer = this.state.showStartButton ? (
      <Btn setTimer={this.setTimer} title="SET TIMER" />
    ) : null;
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{this.state.displayTime}</Text>
        <Input
          textChanged={inputTime =>
            this.setState(previousState => {
              return { ...previousState, inputTime: inputTime };
            })
          }
        />
        {setTimer}
        {button}
      </View>
    );
  }
}

//Whole Container Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default Timey;
