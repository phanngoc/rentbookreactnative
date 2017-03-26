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
  TouchableOpacity
} from 'react-native';

import {BASE_URL} from '../const';

export default class Nearest extends Component {

  constructor() {
    super();
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    var self = this;
    let location = navigator.geolocation.getCurrentPosition(
      (position) => {
        let query = "lat=" + position.coords.latitude + "&lng=" + position.coords.longitude;
        self.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        fetch(BASE_URL+'/api/books/nearest?' + query, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
        .then((response) => response.json())
        .then(function(responseJson) {
          self.setState({books: responseJson.body});
        })
        .catch(function(error) {
        });

        return {lat: position.coords.latitude, lng: position.coords.longitude}
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  buildMarker() {
    let compoMarker = [];
    _.forEach(this.state.books, function(book, key) {
      let pos = {latitude: book.user.locations[0].lat,
        longitude: book.user.locations[0].lng};
      let marker = (<MapView.Marker
        key={key}
        coordinate={pos}
        title={book.title}
        description={book.description}
        />)
        compoMarker.push(marker);
    });
    return compoMarker;
  }

  mapPressed(event) {
    const pointCoords = [event.nativeEvent.coordinate.longitude,
                     event.nativeEvent.coordinate.latitude];
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
           tabLabel='Maps'
           style={styles.map}
           onPress={this.mapPressed}
           region={this.state}
         >
         {this.buildMarker()}
         </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

AppRegistry.registerComponent('Nearest', () => Nearest);
