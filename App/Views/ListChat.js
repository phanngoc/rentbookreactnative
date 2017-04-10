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
  AsyncStorage,
  ListView
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import {BASE_URL, BASE_SOCK_URL} from '../const';
import SocketIOClient from 'socket.io-client';
import uuid from 'react-native-uuid';

const styles = StyleSheet.create({
  wrProfile: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row'
  },
  itemCommentAvatar: {
    flex: 1,
    width: 48,
    height: 48,
    borderRadius: 24
  },
  infoComment: {
    flex: 4,
    flexDirection: 'column'
  },
  infoCommentName: {
    flex: 1,
  },
  infoCommentTime: {
    flex: 1,
  },
  itemComment: {
    backgroundColor: '#f4e2a1',
    borderTopColor: '#895700',
    borderTopWidth: 2,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5
  },
  wrCommentContent: {
    flex: 1,
    padding: 5
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f7f5e3',
    borderRadius: 2,
    paddingTop: 2,
    paddingLeft: 2
  },
  wrList: {
    flex: 1,
  },
  titleLabel: {
    color: '#a06114',
    fontWeight: 'bold'
  },
  wrTitleLabel: {
    padding: 5
  }
});

export default class ListChat extends Component {

  static propTypes = {

  };

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSourceChats: ds.cloneWithRows([]),
    };

  }


  componentWillMount() {
    let self = this;
    fetch(BASE_URL + '/api/threads?book_id=' + this.props.book_id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': self.props.token
      }
    })
    .then((response) => response.json())
    .then(function(responseJson) {
      if (responseJson.success == true) {
        self._attachListChats(responseJson.body);
      }
    });
  }

  getUserOpposite(rowChat) {
    let oppositeUser;
    if (rowChat.person_one.id == this.props.user.id) {
      oppositeUser = rowChat.person_two;
    } else {
      oppositeUser = rowChat.person_one;
    }
    return oppositeUser;
  }

  onPressChat(rowChat) {
    let oppositeUser = this.getUserOpposite(rowChat);
    this.props.navigatorMain.push({name: 'Chat', passProps: {user: oppositeUser, book_id: this.props.book_id}})
  }

  _renderRowChat(rowChat) {
    let oppositeUser = this.getUserOpposite(rowChat);
    return (
      <TouchableHighlight onPress={this.onPressChat.bind(this, rowChat)}>
        <View style={styles.itemComment}>
          <View style={styles.wrProfile}>
            <Image style={styles.itemCommentAvatar}
              resizeMode="contain"
              source={{uri: oppositeUser.avatar}} />
            <View style={styles.infoComment}>
              <Text style={styles.infoCommentName}>
                {oppositeUser.name}
              </Text>
              <Text style={styles.infoCommentTime}>
                {rowChat.created_at}
              </Text>
            </View>
          </View>

          <View style={styles.wrCommentContent}>
            <Text style={styles.commentContent}>
              {rowChat.text}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _attachListChats(chats) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSourceChats: ds.cloneWithRows(chats)});
  }

  render() {
    return (
      <View style={styles.wrList}>
        <View style={styles.wrTitleLabel}>
          <Text style={styles.titleLabel}>New messages</Text>
        </View>
        <ListView
          dataSource={this.state.dataSourceChats}
          renderRow={this._renderRowChat.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }
};

AppRegistry.registerComponent('ListChat', () => ListChat);
