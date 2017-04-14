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
  Alert,
  Linking
} from 'react-native';

import {BASE_URL} from '../const';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import ImagePicker from 'react-native-image-picker';
import t from 'tcomb-form-native';
import Dimensions from 'Dimensions';
import FloatLabelTextInput from 'react-native-floating-label-text-input';
import OpenSettings from 'react-native-open-settings';

var Form = t.form.Form;

var CreateBookForm = t.struct({
  title: t.Str,
  description: t.Str
});

var optionsForm = {
  fields: {
    title: {

    },
    description: {
      placeholder: 'Some thing about book',
      multiline: true,
      numberOfLines: 3
    },
  }
};

var heightWindow = Dimensions.get('window').height;
var widthWindow = Dimensions.get('window').width;

export default class CreateBook extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      images: [],
    }
  }

  async componentDidMount() {

  }

  uploadImages() {
    var options = {
      title: 'Select Images Book',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    var self = this;

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let images = _.union(self.state.images, [response]);
        self.setState({
          images: images
        });
      }
    });
  }

  buildImagePreview() {
    var listImageView = [];
    this.state.images.map(function(value, key) {
      let imageView = (
        <View style={styles.wrImagePreview} key={key}>
          <Image style={styles.imagePreview} source={{uri: value.uri}}
            resizeMode="contain" />
        </View>
      );
      listImageView.push(imageView);
    });
    let btnAddView = (
      <TouchableOpacity onPress={this.uploadImages.bind(this)} style={styles.wrImagePreview} key={this.state.images.length}>
        <Image source={require('../../img/icon_upload.png')} style={styles.btnAddImage}
          resizeMode="contain" />
      </TouchableOpacity>
    )
    listImageView.push(btnAddView);
    return listImageView;
  }

  onChange() {
  }

  async onCreateBook() {
    var token = await AsyncStorage.getItem('token');
    var self = this;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let formdata = new FormData();
        formdata.append("title", self.state.title);
        formdata.append("description", self.state.description);
        formdata.append("lat", position.coords.latitude);
        formdata.append("lng", position.coords.longitude);
        _.forEach(self.state.images, function(value) {
          formdata.append("images", {uri: value.uri, name: value.fileName, type: 'multipart/form-data'});
        });

        fetch(BASE_URL + '/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token
          },
          body: formdata
        })
        .then((response) => response.json())
        .then(response => {
          if (response.success) {
            self.props.navigatorMain.pop();
          }
        }).catch(err => {
          console.log(err);
        });
      },
      (error) => {
        Alert.alert(
          'Alert',
          'Please turn on location to update location where book can borrowed',
          [
            {text: 'Go to setting page', onPress: () => OpenSettings.openSettings()},
            {text: 'Cancel', onPress: () => {self.props.navigatorMain.pop()}, style: 'cancel'},
          ],
          { cancelable: false }
        )
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  onChangeText(label, e) {
    this.state[label] = e;
  }

  render() {
    return (
        <Image source={require('../../img/subtle-vertical-stripes.png')}
          style={styles.backgroundImage}>
          <View style={styles.container}>
            <View style={styles.wrImages}>
              <ScrollView
                 ref={(scrollView) => { this._scrollView = scrollView; }}
                 onScroll={() => { console.log('onScroll!'); }}
                 scrollEventThrottle={200}
                 horizontal={true}
                 style={styles.scrollView}>
                 {this.buildImagePreview()}
               </ScrollView>
            </View>
            <View style={styles.form}>
              <View style={styles.formElem}>
                <FloatLabelTextInput
                  style={styles.title}
                  placeholder={"Title"}
                  value={this.state.title}
                  onChangeTextValue={this.onChangeText.bind(this, 'title')}
                />
              </View>
              <View style={styles.formElemDes}>
                <FloatLabelTextInput
                  style={styles.description}
                  placeholder={"Description"}
                  value={this.state.description}
                  onChangeTextValue={this.onChangeText.bind(this, 'description')}
                  multiline = {true}
                  numberOfLines = {3}
                />
              </View>
            </View>
            <Button style={styles.btnSubmit} title="Create Book" onPress={this.onCreateBook.bind(this)}></Button>
          </View>
        </Image>
    );
  }
}

const styles = StyleSheet.create({
  title:{
  },
  description:{
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  form: {
    flex: 3,
    justifyContent: "flex-start"
  },
  formElem: {
    height: 45
  },
  formElemDes: {
    height: 135
  },
  wrImages: {
    flex: 1
  },
  btnSubmit: {
    flex: 1
  },
  scrollView: {
    height: 123,
    backgroundColor: '#eaeaea'
  },
  wrImagePreview: {
    width: widthWindow / 3,
    height: 120,
    padding: 3,
    borderColor: '#bcbcbc',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 3
  },
  imagePreview: {
    width: widthWindow / 3 - 10,
    height: 114
  },
  btnAddImage: {
    width: widthWindow / 3 - 10,
    height: 114
  }
});

AppRegistry.registerComponent('CreateBook', () => CreateBook);
