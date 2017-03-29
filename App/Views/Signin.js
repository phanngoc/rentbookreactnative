import React, { Component } from 'react';
import MapView from 'react-native-maps';
import _ from 'lodash';
import t from 'tcomb-form-native';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Button
} from 'react-native';

var Form = t.form.Form;
// here we are: define your domain model
var SigninForm = t.struct({
  username: t.String,              // a required string
  password: t.String,  // an optional string
});

var options = {
  fields: {
    username: {
      // name field configuration here..
    },
    password: {
      password: true,
      secureTextEntry: true
    }
  }
}; // optional rendering options (see documentation)

import {BASE_URL} from '../const';

export default class Signin extends Component {
  constructor() {
    super();
  }

  componentDidMount() {

  }

  onPress() {
    var value = this.refs.form.getValue();
    var self = this;
    if (value) {
      fetch(BASE_URL+'/api/authenticate', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(value)
      })
      .then((response) => response.json())
      .then(function(responseJson) {
        AsyncStorage.setItem('token', responseJson.body.token);
        AsyncStorage.setItem('user', JSON.stringify(responseJson.body.user));
        self.props.navigator.push({
          name: 'Profile',
          passProps: {}
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }

  onChange() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={SigninForm}
          options={options}
          onChange={this.onChange}
          />
        <Button
           onPress={this.onPress.bind(this)}
           title="Save"
           accessibilityLabel="See an informative alert"
         />
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

AppRegistry.registerComponent('Signin', () => Signin);
