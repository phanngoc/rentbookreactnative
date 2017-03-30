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
  Button,
  Image
} from 'react-native';

import {BASE_URL} from '../const';
import SearchBar from 'react-native-material-design-searchbar';
import GiftedListView from 'react-native-gifted-listview';

export default class Search extends Component {
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
    console.log(rowData+' pressed');
  }

  async _fetchNetwork(callback, page = 1) {
    var self = this;
    let token = await AsyncStorage.getItem('token');
    let location = navigator.geolocation.getCurrentPosition(
      (position) => {
        let query = "lat=" + position.coords.latitude + "&lng=" + position.coords.longitude
          + "&q=" + this.state.text + "&page=" + page;
        fetch(BASE_URL+'/api/books/search?' + query, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        })
        .then((response) => response.json())
        .then(function(responseJson) {
          console.log("responseJson", responseJson.body);
          if (responseJson.body.isLast) {
            callback(responseJson.body.books, {
              allLoaded: true, // the end of the list is reached
            });
          } else {
            callback(responseJson.body.books);
          }
        })
        .catch(function(error) {
        });

        return {lat: position.coords.latitude, lng: position.coords.longitude}
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  async onChange(text) {
    this.setState({text: text});
    console.log("onChange", text, this.refs.listResults);
    this.refs.listResults._refresh();
    // this.refs.listResults._postRefresh(null, {external: true});
  }

  _renderRowResult(rowResult) {
    var linkImageBook = rowResult.images.length != 0 ? {uri: rowResult.images[0].link} : require('../../img/cover-image.jpg');
    return (
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
    )
  }

  onEndReached() {
    console.log("onEndReached");
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.areaSearch}>
          <SearchBar
            onSearchChange={this.onChange.bind(this)}
            height={30}
            onFocus={() => console.log('On Focus')}
            onBlur={() => console.log('On Blur')}
            placeholder={'Search...'}
            autoCorrect={false}
            padding={2}
            returnKeyType={'search'}
            />
        </View>
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

AppRegistry.registerComponent('Search', () => Search);
