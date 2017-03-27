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
  BackAndroid
} from 'react-native';

import MapView from 'react-native-maps';
import {BASE_URL} from '../const';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';

export default class BookDetail extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      title: '',
      description: '',
      user: '',
      images: [],
      dataSourceComments: ds.cloneWithRows([]),
      comments: []
    }
  }

  componentDidMount() {
    var self = this;
    fetch(BASE_URL + '/api/books/5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then(function(responseJson) {
      if (responseJson.success == true) {
        self.setState(responseJson.body);
        self._attachImages(responseJson.body.images);
        self._attachComments(responseJson.body.comments);
      }
    });
  }

  _attachImages(actions) {

  }

  _attachComments(comments) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSourceComments: ds.cloneWithRows(comments)});
  }

  _renderRowComment(rowComment) {
    return (
      <View style={styles.itemComment}>
        <View style={styles.wrProfile}>
          <Image style={styles.itemCommentAvatar}
            source={{uri: rowComment.user.avatar}} />
          <View style={styles.infoComment}>
            <Text style={styles.infoCommentName}>
              {rowComment.user.name}
            </Text>
            <Text style={styles.infoCommentTime}>
              {rowComment.created_at}
            </Text>
          </View>
        </View>

        <View style={styles.wrCommentContent}>
          <Text style={styles.commentContent}>
            {rowComment.content}
          </Text>
        </View>
      </View>

    )
  }

  _buildImagesSlide() {
    let viewImages = [];
    _.forEach(this.state.images, function(value, key) {
      let link = value.link + '?random_number=' + new Date().getTime();
      viewImages.push(<View style={styles.slide} key={key}>
        <Image
          style={styles.imageSlide}
          source={{uri: link}}
          resizeMode="contain"
        />
      </View>)
    });
    return viewImages;
  }

  async submitComment() {
    let self = this;
    let token = await AsyncStorage.getItem('token');
    fetch(BASE_URL + '/api/books/5/comments', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify({
        content: this.state.text,
      })
    })
    .then((response) => response.json())
    .then(function(responseJson) {
      if (responseJson.success == true) {
        self.state.comments.unshift(responseJson.body);
        self._attachComments(self.state.comments);
        self.refs.modalComment.close();
      }
    });
  }

  render() {
    return (
        <Image source={require('../../img/subtle-vertical-stripes.png')}
          style={styles.backgroundImage}>
          <View style={styles.container}>
            <Swiper style={styles.wrapperImages} showsButtons={true} height={200}
              horizontal={true} autoplay>
              {this._buildImagesSlide()}
            </Swiper>
            <View style={styles.wrAvatar}>
              <Image
                style={styles.avatar}
                source={{uri: this.state.user.avatar}}
              />
              <Text style={styles.name}>{this.state.user.name}</Text>
            </View>
            <View style={styles.wrInfo}>
              <Text style={styles.description}>{this.state.description}</Text>
            </View>
            <View style={styles.wrComment}>
              <View style={styles.wrCommentLabel}>
                <Text style={styles.wrCommentLabelText}>
                  Comments
                </Text>
                <Icon name="plus-circle" size={30} color="#f7d756"
                  style={styles.wrCommentLabelIcon} onPress={() => {console.log("co open modal"); this.refs.modalComment.open();}} />
              </View>
              <ListView
                dataSource={this.state.dataSourceComments}
                renderRow={this._renderRowComment.bind(this)}
                enableEmptySections={true}
              />
            </View>
            <Modal style={[styles.modalComment]} position={"center"} ref={"modalComment"} backdropPressToClose={false}>
              <View style={styles.frComment}>
                <View style={styles.frCommentLabel}>
                  <Text style={styles.frCommentLabelText}>
                    Add your comment
                  </Text>
                </View>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => this.setState({text})}
                  style={styles.frCommentTextInput}
                  />
                <View style={styles.frCommentControl}>
                  <Button
                    onPress={() => this.refs.modalComment.close()}
                    title="Cancel"
                    color="#841584"
                  />
                  <Button
                    onPress={this.submitComment.bind(this)}
                    title="Submit"
                    color="#841584"
                  />
                </View>
              </View>
            </Modal>
          </View>
        </Image>
    );
  }
}

BackAndroid.addEventListener('hardwareBackPress', function() {
 // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
 // Typically you would use the navigator here to go to the last state.
   this.props.navigatorMain.pop();
   return true;
});


const styles = StyleSheet.create({
  // Style modal comment
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  frComment: {
    flex: 1,
    flexDirection: 'column'
  },
  frCommentLabel: {
    padding: 16
  },
  frCommentLabelText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#9b6022'
  },
  frCommentControl: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5
  },
  frCommentTextInput: {
    backgroundColor: '#f9efca'
  },
 // End style modal comment

 // Style list comment
  modalComment: {
    // justifyContent: 'center',
    // alignItems: 'center',
    height: 200
  },
  wrProfile: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row'
  },
  itemCommentAvatar: {
    flex: 1,
    width: 48,
    height: 48,
    borderRadius: 24
  },
  infoComment: {
    flex: 4,
    flexDirection: 'column'
  },
  infoCommentName: {
    flex: 1,
  },
  infoCommentTime: {
    flex: 1,
  },
  itemComment: {
    backgroundColor: '#f4e2a1',
    borderTopColor: '#895700',
    borderTopWidth: 2,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5
  },
  wrCommentContent: {
    flex: 1,
    padding: 5
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f7f5e3',
    borderRadius: 2,
    paddingTop: 2,
    paddingLeft: 2
  },
  wrCommentLabel: {
    flexDirection: 'row',
  },
  wrCommentLabelText: {
    flex: 1,
    justifyContent: 'space-between',
    fontWeight: 'bold',
    color: '#91781d',
    paddingLeft: 4,
    fontSize: 16
  },
  wrCommentLabelIcon: {
    paddingRight: 4
  },
 // End style list comment
  container: {
    flex: 1,
  },
  wrapperImages: {
    flex: 1,
  },
  wrAvatar: {
    flex: 1,
    padding: 5
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
  wrInfo: {
    minHeight: 48,
    padding: 5
  },
  description: {

  },
  wrComment: {
    flex: 3
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9e9e9e'
  },
  imageSlide: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapperImages: {
    flex: 1,
  },
});

AppRegistry.registerComponent('BookDetail', () => BookDetail);
