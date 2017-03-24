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
  TouchableHighlight
} from 'react-native';

import Signin from '../Views/Signin'
import Profile from '../Views/Profile'

const styles = StyleSheet.create({
  menu: {
    width: window.width,
    height: window.height,
    padding: 20,
  },
  contentContainerStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
    padding: 5,
    backgroundColor: "#e8e8e8"
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 15,
    fontWeight: "bold",
    fontSize: 16
  },
  item: {
    marginTop: 5,
    backgroundColor: "#841584",
  },
});

export default class Menu extends Component {
  static propTypes = {

  };

  onPressSignIn(navigator) {
    navigator.push({
      name: 'Signin',
      passProps: {}
    })
  }

  onPressRegister() {

  }

  renderScene(route, navigator) {
    if (route.name == 'Signin') {
      return <Signin navigator={navigator} {...route.passProps} />
    } else if (route.name == 'Menu') {
      return (
        <ScrollView scrollsToTop={false} style={styles.menu}
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={require('../../img/logo_og.png')}
            />
            <Text style={styles.name}>Your name</Text>
          </View>
          <View style={styles.item}>
            <Button
              onPress={this.onPressSignIn.bind(this, navigator)}
              title="Sign in"
              accessibilityLabel="Sign in account"
            />
          </View>
          <View style={styles.item}>
            <Button
              onPress={this.onPressRegister.bind(this)}
              title="Register"
              accessibilityLabel="Register account"
            />
          </View>
        </ScrollView>
      )
    } else if (route.name == 'Profile') {
      return <Profile navigator={navigator} {...route.passProps} />
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'Menu', passProps: {}}}
        renderScene={this.renderScene.bind(this)}
        />
    );
  }
};

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
        <Button
        title="Back"
        accessibilityLabel="Register account"
      />
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'yellow', margin: 10, fontSize: 16}}>
          登录
        </Text>
      </TouchableOpacity>
    );
  }
};

AppRegistry.registerComponent('Menu', () => Menu);
