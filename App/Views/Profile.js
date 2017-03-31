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
import {BASE_URL} from '../const';

export default class Profile extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      username: '',
      phone: '',
      address: '',
      page: 'first',
      dataSourceBooks: ds.cloneWithRows([]),
      dataSourceBooksBorrow: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('token', function(error, result) {
      fetch(BASE_URL + '/api/users/myprofile', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': result
        }
      })
      .then((response) => response.json())
      .then(function(responseJson) {
        console.log("responseJson", responseJson);
        if (responseJson.success == true) {
          self.setState(responseJson.body);
          self._attachBooks(responseJson.body.books);
          self._attachBooksBorrow(responseJson.body.actions);
        } else {
          self.props.navigator.push({name: 'Signin', passProps: {}});
        }
      }).catch(function(error) {
        console.log("error", error);
      })
    });
  }

  _attachBooksBorrow(actions) {
    let booksBorrow = _.map(actions, function(action) {
      return _.pick(action, ['book']).book;
    });
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSourceBooksBorrow: ds.cloneWithRows(booksBorrow)});
  }

  _attachBooks(books) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSourceBooks: ds.cloneWithRows(books)});
  }

  _onPressRow(rowData) {
    this.props.navigatorMain.push({name: "BookDetail", passProps: {bookId: rowData.id}});
  }

  _renderRowBook(rowData) {
    return (
      <View style={styles.itemBook}>
        <Image style={styles.itemImageBook}
          source={require('../../img/logo_og.png')} />
        <TouchableHighlight onPress={this._onPressRow.bind(this, rowData)} style={styles.wrItemBook}>
          <View style={styles.itemInfo}>
            <Text>
              {rowData.title}
            </Text>
            <Text>
              {rowData.description}
            </Text>
          </View>
        </TouchableHighlight>
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
        renderRow={this._renderRowBook.bind(this)}
        enableEmptySections={true}
      />);
    } else if (this.state.page == 'second') {
      return (this._buildMap());
    } else if (this.state.page == 'third') {
      return (<ListView
        dataSource={this.state.dataSourceBooksBorrow}
        renderRow={this._renderRowBook.bind(this)}
        enableEmptySections={true}
      />);
    }
  }

  render() {
    return (
      <Image source={require('../../img/subtle-vertical-stripes.png')}
        style={styles.backgroundImage}>
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
          <View
            style={styles.contentTab}
            >
            {this._tabShow()}
          </View>
          <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
                 selectedStyle={{color:'red'}} onSelect={el => this.setState({page: el.props.name})}>
               <Text name="first">Books</Text>
               <Text name="second">Maps</Text>
               <Text name="third">Borrow</Text>
           </Tabs>
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    flex: 1,
  },
  itemLabel: {
    fontWeight: 'bold',
    color: '#f9872f'
  },
  itemContent: {
    color: '#ce9163'
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
  contentTab: {
    flex: 2,
  },
  wrItemBook: {
    flex: 1,
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
  },
});

AppRegistry.registerComponent('Profile', () => Profile);
