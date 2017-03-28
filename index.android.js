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
    }

    this.btnPlus = null;
    this._previousLeft = 0;
    this._previousTop = 0;
    this.animRotate = this.animRotate || new Animated.Value(0);

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

  getDirectionAndColor({ moveX, moveY, dx, dy}) {
    const draggedDown = dy > 30;
    const draggedUp = dy < -30;
    const draggedLeft = dx < -30;
    const draggedRight = dx > 30;
    const isRed = moveY < 90 && moveY > 40 && moveX > 0 && moveX < width;
    const isBlue = moveY > (height - 50) && moveX > 0 && moveX < width;
    let dragDirection = '';

    if (draggedDown || draggedUp) {
      if (draggedDown) dragDirection += 'dragged down '
      if (draggedUp) dragDirection +=  'dragged up ';
    }

    if (draggedLeft || draggedRight) {
      if (draggedLeft) dragDirection += 'dragged left '
      if (draggedRight) dragDirection +=  'dragged right ';
    }

    if (isRed) return `red ${dragDirection}`
    if (isBlue) return `blue ${dragDirection}`
    if (dragDirection) return dragDirection;
  }

  componentWillMount() {
    let self = this;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },

      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        console.log("onStartShouldSetPanResponderCapture", gestureState.dx,
          gestureState.dy);
        return gestureState.dx != 0 && gestureState.dy != 0;
      },


      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },

      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        console.log("onMoveShouldSetPanResponderCapture", gestureState.dx,
          gestureState.dy);
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
    console.log('onPressPlus');
    Animated.timing(          // Uses easing functions
       this.animRotate,    // The value to drive
       {toValue: 1, duration: 500}            // Configuration
     ).start();                // Don't forget start!
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.btnCreate}
          ref={(btnPlus) => {
            this.btnPlus = btnPlus;
          }}
          {...this._panResponder.panHandlers}
          >
          <View style={styles.menu}>
            <View style={styles.menuCreateBook}>
              <Button style={styles.menuCreateBook} title="Create book"></Button>
            </View>
            <View style={styles.menuCreateBook}>
              <Button style={styles.menuCreateBook} title="Library"></Button>
            </View>
          </View>
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
    marginBottom: 3,
  },
  menu: {
    justifyContent: 'space-around',
    flexDirection: 'column'
  },
  btnCreate: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    // width: 120,
    // height: 120,
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

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
