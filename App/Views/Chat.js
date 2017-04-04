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
        console.log('userCurrent', user);
        self.userCurrent = user;
      })

      self.socket.on('messages', (messages) => {
        var messageConvert = self.convertListWithKey_Id(messages);
        var messagesArray = GiftedChat.append(self.state.messages, messageConvert);
        self.setState({messages: messagesArray});
      });

      self.socket.on('broadcast_message', (message) => {
        console.log("message receive client", [message]);
        var messageConvert = self.convertListWithKey_Id([message], self.userCurrent.id);
        console.log("messagesArray client", messageConvert);
        var messagesArray = GiftedChat.append(self.state.messages, messageConvert);
        self.setState({messages: messagesArray});
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
