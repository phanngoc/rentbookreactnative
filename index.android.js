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

import Nearest from './App/Components/Nearest'
import Menu from './App/Components/Menu'
import BookDetail from './App/Views/BookDetail'
import CreateBook from './App/Views/CreateBook'
import GlobalMenu from './App/Components/GlobalMenu'
import Search from './App/Views/Search'
import Trending from './App/Views/Trending'

export default class AwesomeProject extends Component {

  constructor() {
    super();
    this.state = {
      initialRoute: {name: "Main", passProps: {}},
      isExpand: false,
    }
  }

  componentDidMount() {

  }

  renderScene(route, navigator) {
    let innerView;
    if (route.name == 'Main') {
      innerView = (<ScrollableTabView
        renderTabBar={() => <DefaultTabBar />}
        ref={(tabView) => { this.tabView = tabView; }}
      >
         <Menu tabLabel='Profile' navigatorMain={navigator}
           {...route.passProps}/>
         <Nearest tabLabel='Nearest'/>
         <Trending tabLabel='Trending' navigatorMain={navigator} />
         <Search tabLabel='Search' navigatorMain={navigator}></Search>
      </ScrollableTabView>);
    } else if (route.name == 'BookDetail') {
      innerView = <BookDetail navigatorMain={navigator} {...route.passProps} />
    } else if (route.name == 'CreateBook') {
      innerView = <CreateBook navigatorMain={navigator} {...route.passProps} />
    }
    return (<View style={{flex: 1}}>
      <GlobalMenu navigatorMain={navigator} />
      {innerView}
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
