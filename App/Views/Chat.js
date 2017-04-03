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

  componentWillMount() {
    var self = this;
    AsyncStorage.getItem('token', function(error, result) {
      self.socket = SocketIOClient(BASE_SOCK_URL, {transports: ['websocket'], query: 'token=' + result + '&user_id' + this.props.user.id});
      self.socket.on('new_message', (msg) =>{
        console.log('receive response', msg);
      });
    });
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages=[]) {
    console.log("onSend", messages);
    this.socket.emit('message', messages[0]);
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
        user={{_id: 1}}
      />
    );
  }
};

AppRegistry.registerComponent('Chat', () => Chat);
