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

const styles = StyleSheet.create({

});

export default class Waiting extends Component {
  static propTypes = {

  };

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
    let self = this;
    AsyncStorage.getItem('token', function(error, result) {
      console.log("get token to choose user", result);
      if (result) {
        self.props.navigator.push({name: 'Profile', passProps: {}});
      } else {
        self.props.navigator.push({name: 'Menu', passProps: {}});
      }
    });
  }

  render() {
    return (
      <View></View>
    );
  }
};

AppRegistry.registerComponent('Waiting', () => Waiting);
