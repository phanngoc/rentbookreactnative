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

export default class AwesomeProject extends Component {

  constructor() {
    super();
    this.state = {
      initialRoute: {name: "Main", passProps: {}},
      isExpand: false,
    }

    this.btnPlus = null;
    this._previousLeft = 0;
    this._previousTop = 0;
    this.animRotate = this.animRotate || new Animated.Value(0);
    this.animMenuOpa = this.animMenuOpa || new Animated.Value(0);
    this.animMenuTran = this.animMenuTran || new Animated.Value(0);

    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
      }
    };
  }

  _updateNativeStyles() {
    this.btnPlus && this.btnPlus.setNativeProps(this._circleStyles);
  }

  _highlight() {
    // Animated.timing(          // Uses easing functions
    //    this.animRotate,    // The value to drive
    //    {toValue: 1, duration: 500}            // Configuration
    //  ).start();
  }

  _unHighlight() {
    // Animated.timing(          // Uses easing functions
    //    this.animRotate,    // The value to drive
    //    {toValue: 0, duration: 500}            // Configuration
    //  ).start();
  }

  componentWillMount() {
    let self = this;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },

      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },


      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },

      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },

      onPanResponderGrant: (evt, gestureState) => {
        self._highlight();
      },

      onPanResponderMove: (evt, gestureState) => {
        self._circleStyles.style.left = this._previousLeft + gestureState.dx;
        self._circleStyles.style.top = this._previousTop + gestureState.dy;
        self._updateNativeStyles();
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        self._unHighlight();
        self._previousLeft += gestureState.dx;
        self._previousTop += gestureState.dy;
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  componentDidMount() {

  }

  renderScene(route, navigator) {
    if (route.name == 'Main') {
      return (<ScrollableTabView
        renderTabBar={() => <DefaultTabBar />}
        ref={(tabView) => { this.tabView = tabView; }}
      >
         <Menu tabLabel='Profile' navigatorMain={navigator}
           {...route.passProps}/>
         <Nearest tabLabel='Nearest'/>
         <Text tabLabel='Trending'>favorite</Text>
         <Text tabLabel='Search'>project</Text>
      </ScrollableTabView>);
    } else if (route.name == 'BookDetail') {
      return <BookDetail navigatorMain={navigator} {...route.passProps} />
    }
  }

  onPressPlus() {
    if (this.state.isExpand) {
     Animated.timing(
         this.animRotate,
         {toValue: 0, duration: 500}
       ).start();

     Animated.parallel([
        Animated.timing(this.animMenuOpa, {
          toValue: 0,
          duration: 500
        }),
        Animated.timing(this.animMenuTran, {
          toValue: 0,
          duration: 500
        })
     ]).start();

     let self = this;
     setTimeout(
      function() {
        self.setState({isExpand: !self.state.isExpand});
      }, 500);
    } else {
      Animated.timing(
         this.animRotate,
         {toValue: 1, duration: 500}
       ).start();

      Animated.parallel([
          Animated.timing(this.animMenuOpa, {
            toValue: 1,
            duration: 500
          }),
          Animated.timing(this.animMenuTran, {
            toValue: 1,
            duration: 500
          })
       ]).start();

       this.setState({isExpand: !this.state.isExpand})
    }
  }

  render() {
    let menuBlock = (
      <View style={styles.menu}>
        <Animated.View
           style={{
             transform: [
               {
                 translateY: this.animMenuTran.interpolate({
                   inputRange: [0, 1],
                   outputRange: [
                     1, 10
                   ],
                 })
               }
             ],
            opacity: this.animMenuOpa
           }}>
          <View style={styles.menuCreateBook}>
           <Button style={styles.menuCreateBook} title="Create book"></Button>
          </View>
          <View style={styles.menuCreateBook}>
           <Button style={styles.menuCreateBook} title="Library"></Button>
          </View>
          <View style={styles.menuCreateBook}>
           <Button style={styles.menuCreateBook} title="Library"></Button>
          </View>
        </Animated.View>
      </View>
    );

    let menuView = (<View></View>);

    if (this.state.isExpand == true) {
      menuView = menuBlock;
    }

    return (
      <View style={styles.wrapper}>
        <View style={styles.btnCreate}
          ref={(btnPlus) => {
            this.btnPlus = btnPlus;
          }}
          {...this._panResponder.panHandlers}
          >
          {menuView}
          <TouchableOpacity onPress={this.onPressPlus.bind(this)} >
            <Animated.View
               style={{
                 transform: [   // Array order matters
                   {rotate: this.animRotate.interpolate({
                     inputRange: [0, 1],
                     outputRange: [
                       '0deg', '90deg' // 'deg' or 'rad'
                     ],
                   })},
                 ]
               }}>
             <Image style={styles.imagePlus}
               source={require('./img/plusgoogle.png')} />
            </Animated.View>
          </TouchableOpacity>
        </View>
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
  menuCreateBook: {
    marginBottom: 4,
  },
  menu: {
    justifyContent: 'space-around',
    flexDirection: 'column',
    marginTop: -10
  },
  btnCreate: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  imagePlus: {
    width: 48,
    height: 48
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
