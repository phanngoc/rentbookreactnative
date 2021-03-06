/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import MapView from 'react-native-maps';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Navigator,
  BackAndroid,
  Image,
  PanResponder,
  Animated,
  Button
} from 'react-native';

import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

import Nearest from './App/Components/Nearest'
import Menu from './App/Components/Menu'
import BookDetail from './App/Views/BookDetail'
import CreateBook from './App/Views/CreateBook'
import GlobalMenu from './App/Components/GlobalMenu'
import Search from './App/Views/Search'
import Trending from './App/Views/Trending'
import Chat from './App/Views/Chat'
import ListChat from './App/Views/ListChat'

import {BASE_URL, BASE_SOCK_URL} from './App/const'

export default class AwesomeProject extends Component {

  constructor() {
    super();
    this.state = {
      initialRoute: {name: "Main", passProps: {}},
      isExpand: false,
      page: 0
    }
    this.navigator = null;
  }

  async componentWillMount() {
    var self = this;
    var userCurrent = await AsyncStorage.getItem('user');
    var token = await AsyncStorage.getItem('token');

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      console.log("notificationListener", notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      console.log("refreshTokenListener", token);
    });

    FCM.getInitialNotification().then(notif => {
      console.log('getInitialNotification', notif, RemoteNotificationResult.NewData, WillPresentNotificationResult.All);
      if (notif.book_id && notif.opened_from_tray) {
        self.navigator.immediatelyResetRouteStack([
          {name: "Main", passProps: {}},
          {name: "BookDetail", passProps: {bookId: notif.book_id}},
          {name: "ListChat", passProps: {token: token, user: JSON.parse(userCurrent), book_id: notif.book_id}}
        ]);
        self.navigator.push({name: "Chat", passProps: {book_id: notif.book_id, user: JSON.parse(notif.user)}});
      }
    });
    FCM.removeAllDeliveredNotifications();
    FCM.cancelAllLocalNotifications();
  }

  componentDidMount() {

  }

  moveProfile() {
    this.setState({page: 0});
  }

  renderScene(route, navigator) {
    this.navigator = navigator;
    let innerView;
    if (route.name == 'Main') {
      innerView = (<ScrollableTabView
        renderTabBar={() => <DefaultTabBar />}
        ref={(tabView) => { this.tabView = tabView; }}
        initialPage={0}
        tabBarPosition="bottom"
        page={this.state.page}
      >
         <Menu tabLabel='Profile' navigatorMain={navigator}
           {...route.passProps}/>
         <Nearest tabLabel='Nearest' navigatorMain={navigator} moveProfile={this.moveProfile.bind(this)} />
         <Trending tabLabel='Trending' navigatorMain={navigator} />
         <Search tabLabel='Search' navigatorMain={navigator}></Search>
      </ScrollableTabView>);
    } else if (route.name == 'BookDetail') {
      innerView = <BookDetail navigatorMain={navigator} {...route.passProps} />
    } else if (route.name == 'CreateBook') {
      innerView = <CreateBook navigatorMain={navigator} {...route.passProps} />
    } else if (route.name == 'Chat') {
      innerView = <Chat navigatorMain={navigator} {...route.passProps} />
    } else if (route.name == 'ListChat') {
      innerView = <ListChat navigatorMain={navigator} {...route.passProps} />
    }

    return (<View style={{flex: 1}}>
      {innerView}
      <GlobalMenu navigatorMain={navigator} />
    </View>);
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Navigator
          initialRoute={this.state.initialRoute}
          renderScene={this.renderScene.bind(this)}
          ref={(nav) => { navigator = nav; }}
          />
      </View>
    );
  }
}

var navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
