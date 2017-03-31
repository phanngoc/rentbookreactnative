import React, { Component } from 'react';
import MapView from 'react-native-maps';
import _ from 'lodash';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Button,
  Image
} from 'react-native';

import {BASE_URL} from '../const';
import GiftedListView from 'react-native-gifted-listview';

export default class Trending extends Component {

  constructor() {
    super();
    this.state = {
      text: ""
    }
  }

  componentDidMount() {
  }

  _onFetch(page = 1, callback, options) {
    this._fetchNetwork(callback, page);
  }

  _onPress(rowData) {
    this.props.navigatorMain.push({name: "BookDetail", passProps: {bookId: rowData.id}});
    console.log(rowData, 'pressed');
  }

  async _fetchNetwork(callback, page = 1) {
    var self = this;
    let token = await AsyncStorage.getItem('token');
    let query = "page=" + page;
    fetch(BASE_URL + '/api/books/trending?' + query, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then((response) => response.json())
    .then(function(responseJson) {
      if (responseJson.body.isLast) {
        callback(responseJson.body.books, {
          allLoaded: true,
        });
      } else {
        callback(responseJson.body.books);
      }
    })
    .catch(function(error) {
    });
  }

  _renderRowResult(rowResult) {
    var linkImageBook = rowResult.images.length != 0 ? {uri: rowResult.images[0].link} : require('../../img/cover-image.jpg');
    return (
      <TouchableHighlight
        onPress={() => this._onPress(rowResult)}
      >
        <View style={styles.itemResult}>
          <Image style={styles.imageBook}
            source={linkImageBook} resizeMode="contain" />
          <View style={styles.infoBook}>
            <Text style={styles.infoBookTitle}>
              {rowResult.title}
            </Text>
            <View style={styles.infoBookProfile}>
              <Image style={styles.infoBookProfileAvatar}
                source={{uri: rowResult.user.avatar}} />
              <Text style={styles.infoBookProfileName}>
                {rowResult.user.name}
              </Text>
            </View>
            <Text style={styles.infoBookDescription}>
              {rowResult.description}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  onEndReached() {
    console.log("onEndReached");
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.areaResult}>
          <GiftedListView
            enableEmptySections={true}
            rowView={this._renderRowResult.bind(this)}
            onFetch={this._onFetch.bind(this)}
            firstLoader={true}
            pagination={true}
            refreshable={false}
            withSections={false}
            ref={"listResults"}
            customStyles={{
              paginationView: {
                backgroundColor: '#eee',
              },
            }}
            refreshableTintColor="blue"
            onEndReached = {this.onEndReached}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: "column"
  },
  areaSearch: {

  },
  areaResult: {
    flex: 4
  },
  itemResult: {
    flexDirection: "row",
    marginBottom: 3,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderBottomColor: "#efb358",
    borderStyle: "solid"
  },
  imageBook: {
    height: 100,
    width: 110,
    backgroundColor: "#cccccc",
    marginRight: 4
  },
  infoBook: {
    flexDirection: "column"
  },
  infoBookTitle: {

  },
  infoBookProfile: {
    flexDirection: "row"
  },
  infoBookProfileAvatar:{
    width: 35,
    height: 35,
    borderRadius: 5
  },
  infoBookProfileName: {
    fontSize: 13
  }
});

AppRegistry.registerComponent('Trending', () => Trending);
