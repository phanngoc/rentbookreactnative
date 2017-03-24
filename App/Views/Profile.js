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
import Tabs from 'react-native-tabs';

export default class Profile extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      username: '',
      phone: '',
      address: '',
      page: 'first',
      dataSourceBooks: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('token', function(error, result) {
      fetch('http://172.16.3.66:3000/api/users/myprofile', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Ik11cmwgR3JpbWVzIiwiZW1haWwiOiJLaGFsaWwyN0Bob3RtYWlsLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS91aWZhY2VzL2ZhY2VzL3R3aXR0ZXIvcmFjaGVscmV2ZWxleS8xMjguanBnIiwidXNlcm5hbWUiOiJLaWFubmE5OCIsInBhc3N3b3JkIjoiJDJhJDEwJExHdnU3WERpTmtwdTVNa0NlYTV6bXV5cEh5ekVuU0I2VjROR1JaLlQzSklnZUJuYW5JUkxpIiwicGhvbmUiOiIxLTgwMy0yNTUtNzg3NiB4MzIyIiwiY3JlYXRlZF9hdCI6IjIwMTctMDMtMjBUMDg6MzM6NDYuNDMzWiIsInVwZGF0ZWRfYXQiOm51bGwsImFkZHJlc3MiOm51bGwsImlhdCI6MTQ5MDM0NjI3NywiZXhwIjoxNDkwMzQ5ODc3fQ.HPbUeRwLMXbIjo__CRuRmAqYZyVUXP8OsmKtMiB0uQs'
        }
      })
      .then((response) => response.json())
      .then(function(responseJson) {
        console.log('profile', responseJson.success, responseJson.body);
        if (responseJson.success == true) {
          console.log("set state");
          self.setState(responseJson.body);
          self._attachBooks(responseJson.body.books);
        }
      })
    });
  }

  onChange() {

  }

  _attachBooks(books) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSourceBooks: ds.cloneWithRows(books)});
  }

  _renderRowBook(rowData) {
    return (
      <View style={styles.itemBook}>
        <Image style={styles.itemImageBook}
          source={require('../../img/logo_og.png')} />
        <View style={styles.itemInfo}>
          <Text>
            {rowData.title}
          </Text>
          <Text>
            {rowData.description}
          </Text>
        </View>
      </View>

    )
  }

  _buildMarker() {
    let compoMarker = [];
    var self = this;
    _.forEach(this.state.locations, function(location, key) {
      let pos = {latitude: location.lat,
        longitude: location.lng};
      let marker = (<MapView.Marker
        key={key}
        coordinate={pos}
        title={self.state.name}
        />)
        compoMarker.push(marker);
    });
    return compoMarker;
  }

  _buildMap() {
    if (this.state.locations.length == 0) {
      return (<Text>
          We can't receive your location
        </Text>)
    } else {
      const region = {
        latitude: this.state.locations[0].lat,
        longitude: this.state.locations[0].lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      };
      return (
        <MapView
         style={styles.map}
         region={region}>
         {this._buildMarker()}
        </MapView>
      )
    }
  }

  _tabShow() {
    if (this.state.page == 'first') {
      return (<ListView
        dataSource={this.state.dataSourceBooks}
        renderRow={this._renderRowBook}
      />);
    } else if (this.state.page == 'second') {
      return (this._buildMap());
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{uri: this.state.avatar}}
          />
          <Text style={styles.name}>{this.state.name}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Username</Text>
          <Text style={styles.itemContent}>{this.state.username}</Text>
          <Text style={styles.itemLabel}>Address</Text>
          <Text style={styles.itemContent}>{this.state.address}</Text>
          <Text style={styles.itemLabel}>Phone</Text>
          <Text style={styles.itemContent}>{this.state.phone}</Text>
        </View>
        <ScrollView scrollsToTop={false}
          style={styles.contentscroll}
          >
          {this._tabShow()}
        </ScrollView>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
               selectedStyle={{color:'red'}} onSelect={el => this.setState({page: el.props.name})}>
             <Text name="first">Books</Text>
             <Text name="second">Maps</Text>
             <Text name="third">Borrow</Text>
         </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  contentscroll: {

  },
  itemBook: {
    backgroundColor: '#f4e2a1',
    borderTopColor: '#895700',
    borderTopWidth: 2,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5
  },
  itemImageBook: {
    width: 30,
    height: 40,
    marginLeft: 10
  },
  itemInfo: {
    marginLeft: 30
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: 80,
    height: 80
  },
});

AppRegistry.registerComponent('Profile', () => Profile);
