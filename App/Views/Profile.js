import React, { Component } from 'react';
import _ from 'lodash';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

export default class Profile extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    var self = this;
    fetch('http://172.16.3.66:3000/api/myprofile', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then(function(responseJson) {
      if (responseJson.success == true) {
        self.setState(responseJson.body);
      }
    })
  }

  onChange() {

  }

  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    margin: 10,
  },
  buttonText: {
   fontSize: 18,
   color: 'white',
   alignSelf: 'center'
  },
  button: {
   height: 36,
   backgroundColor: '#48BBEC',
   borderColor: '#48BBEC',
   borderWidth: 1,
   borderRadius: 8,
   marginBottom: 10,
   alignSelf: 'stretch',
   justifyContent: 'center'
  }
});

AppRegistry.registerComponent('Profile', () => Profile);
