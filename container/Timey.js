import React, { Component } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import Btn from '../components/Button/ButtonT';
import Input from '../components/Textinput/Input';
import TouchableHighlightT from '../components/TouchableHighlight/TouchableHighlightT';
import axios from 'axios';
import { Timer } from 'react-native-stopwatch-timer';
import PushControl from '../components/PushControl';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import * as keys from '../components/keys/key';
import audio from '../assets/will_full.mp3';

//timer current time
let timex = 0;
//key for backgroundTimer
let timerOut;
let whoosh = new Sound(audio);

class Timey extends Component {
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

  //function to toggle state for start and stop
  toggleTimer() {
    if (timex !== 0 || this.state.timerStart) {
      if (!this.state.timerStart) {
        timerOut = BackgroundTimer.setTimeout(() => {
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
        }, timex);
      } else {
        //if clicked stop to clear bacgroundTimer
        BackgroundTimer.clearTimeout(timerOut);
      }
      //altering state for START and STOP
      this.setState(previousState => {
        return { ...previousState, act: !this.state.act };
      });
      this.setState(previousState => {
        return {
          ...previousState,
          timerStart: !this.state.timerStart,
          timerReset: false
        };
      });
    } else alert('Set some time please'); //if time is 0 on the clock
  }

  //to reset the timer values to default
  resetTimer() {
    this.setState(previousState => {
      return { ...previousState, timerStart: false, timerReset: true };
    });
    BackgroundTimer.clearTimeout(timerOut);
  }

  //to get the current time on the Timer
  getFormattedTime(time) {
    this.currentTime = time;
    timex = Number(time.split(':').join(''));
  }

  //setting up the Timer with totalDuration set from the inputBox
  setTimer = () => {
    if (this.state.text > 0) {
      this.resetTimer();
      let time = this.state.text * 60000;
      this.setState(previousState => {
        return { ...previousState, totalDuration: time };
      });
    } else if (this.state.text < 0) alert('Set a positive time');
    else alert('Set some time please');
  };

  //rendering components
  render() {
    let timeInput = this.state.act ? (
      <Input
        textChanged={text =>
          this.setState(previousState => {
            return { ...previousState, text: text };
          })
        }
      />
    ) : null;

    let button = this.state.act ? <Btn setTimer={this.setTimer} /> : null;
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
        <TouchableHighlightT
          toggleTimer={this.toggleTimer}
          timeStart={!this.state.timerStart ? 'Start' : 'Stop'}
        />
      </View>
    );
  }
}

//function to execute after timer completes
const handleTimerComplete = () => {
  //resetting the state properties for Timer
  reset = () => {
    this.resetTimer();

    this.setState(previousState => {
      return { ...previousState, text: 0, totalDuration: 0 };
    });
  };
};

//styling for the Timer
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

//Whole Container Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});

export default Timey;
