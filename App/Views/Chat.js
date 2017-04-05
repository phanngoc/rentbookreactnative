/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import MapView from 'react-native-maps';
import _ from 'lodash';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
  Navigator,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import { BASE_SOCK_URL } from '../const';
import SocketIOClient from 'socket.io-client';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import uuid from 'react-native-uuid';

const styles = StyleSheet.create({

});

export default class Chat extends Component {
  static propTypes = {

  };

  constructor() {
    super();
    this.state = {
      messages: []
    };

  }

  convertListWithKey_Id(messages, user_id = undefined) {
    var messagesArr;
    messagesArr = _.filter(messages, function(o) {
      return o.user.id != user_id;
    });

    messagesArr = _.map(messagesArr, function(value, index) {
      var res = value;
      res._id = value.id;
      res.user._id = res.user.id;
      return res;
    }).reverse();

    return messagesArr;
  }

  componentWillMount() {
    var self = this;
    AsyncStorage.getItem('token', function(error, result) {
      self.socket = SocketIOClient(BASE_SOCK_URL, {transports: ['websocket'], query: 'token=' + result + '&user_id=' + self.props.user.id});

      self.socket.on('connect', function() {
        console.log('socket connect', self.socket.connected);
      });

      self.socket.on('disconnect', function() {
        console.log('socket disconnect', self.socket.connected);
      });

      self.socket.on('userCurrent', (user) => {
        self.userCurrent = user;
      })

      self.socket.on('messages', (messages) => {
        var messageConvert = self.convertListWithKey_Id(messages);
        self.setState({messages: messageConvert});
      });

      self.socket.on('broadcast_message', (message) => {
        var messageConvert = self.convertListWithKey_Id([message], self.userCurrent.id);
        var messagesArray = GiftedChat.append(self.state.messages, messageConvert);
        self.setState({messages: messagesArray});

        FCM.presentLocalNotification({
            title: "New message",                     // as FCM payload
            body: message.text,                    // as FCM payload (required)
            sound: "default",                                   // as FCM payload
            priority: "high",                                   // as FCM payload
            click_action: "ACTION",                             // as FCM payload
            badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
            number: 10,                                         // Android only
            ticker: "My Notification Ticker",                   // Android only
            auto_cancel: true,                                  // Android only (default true)
            large_icon: "ic_launcher",                           // Android only
            icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
            big_text: "Click to show chat directly",     // Android only
            sub_text: "This is message chat",                      // Android only
            color: "red",                                       // Android only
            vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
            tag: 'some_tag',                                    // Android only
            group: "group",                                     // Android only
            my_custom_data:'my_custom_field_value',             // extra data you want to throw
            lights: true,                                       // Android only, LED blinking (default false)
        });

      });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages=[]) {
    console.log("onSend", messages);
    this.socket.emit('receive_new_message', messages[0]);
    this._storeMessages(messages);
  }

  // Helper functions
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={this.props.user}
      />
    );
  }
};

AppRegistry.registerComponent('Chat', () => Chat);
