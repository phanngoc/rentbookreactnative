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
  ListView,
  Button,
  TextInput,
  BackAndroid,
  Keyboard,
  PanResponder,
  Animated
} from 'react-native';

import Dimensions from 'Dimensions';
var widthWindow = Dimensions.get('window').width;

export default class GlobalMenu extends Component {
  constructor() {
    super();
    this.state = {
      isExpand: false,
      isDisBtnCreate: false
    }

    this.btnPlus = null;
    this._previousLeft = widthWindow - 48;
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
       this.setState({isExpand: !this.state.isExpand});
    }
  }

  render() {
    var currentRoute = this.props.navigatorMain.getCurrentRoutes().pop();
    console.log("currentRoute", currentRoute);

    if (currentRoute.name == "CreateBook") {
      this.state.isDisBtnCreate = true;
    } else {
      this.state.isDisBtnCreate = false;
    }

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
            <Button style={styles.menuCreateBook} onPress={() => this.props.navigatorMain.push({name: 'CreateBook'})}
              title="Create book"
              disabled={this.state.isDisBtnCreate}
              ></Button>
          </View>
        </Animated.View>
      </View>
    );

    let menuView = (<View></View>);

    if (this.state.isExpand == true) {
      menuView = menuBlock;
    }

    return (
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
             source={require('../../img/plusgoogle.png')} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    left: widthWindow - 48,
    zIndex: 100,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  imagePlus: {
    width: 48,
    height: 48
  },
});

AppRegistry.registerComponent('GlobalMenu', () => GlobalMenu);
