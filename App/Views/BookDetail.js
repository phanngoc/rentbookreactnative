import React, { Component } from 'react';
import _ from 'lodash';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Image,
  ScrollView,
  ListView
} from 'react-native';

import MapView from 'react-native-maps';
import {BASE_URL} from '../const';
import Swiper from 'react-native-swiper';

export default class BookDetail extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      title: '',
      description: '',
      user: '',
      images: 'first',
      dataSourceComments: ds.cloneWithRows([]),
    }
  }

  componentDidMount() {
    var self = this;
    fetch(BASE_URL + '/api/books/5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then(function(responseJson) {
      console.log('book detail', responseJson.success, responseJson.body);
      if (responseJson.success == true) {
        self.setState(responseJson.body);
        self._attachImages(responseJson.body.images);
        self._attachComments(responseJson.body.comments);
      }
    });
  }

  _attachImages(actions) {

  }

  _attachComments(comments) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSourceComments: ds.cloneWithRows(comments)});
  }

  _renderRowComment(rowComment) {
    return (
      <View style={styles.itemBook}>
        <Image style={styles.itemImageBook}
          source={require('../../img/logo_og.png')} />
        <View style={styles.itemInfo}>
          <Text>
            {rowData.content}
          </Text>
        </View>
      </View>

    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper style={styles.wrapperImages} showsButtons={true}>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wrapperImages: {

  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  wrapperImages: {
    flex: 1,
  },
});

AppRegistry.registerComponent('BookDetail', () => BookDetail);
