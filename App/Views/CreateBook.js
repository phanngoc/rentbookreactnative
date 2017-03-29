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
  Alert
} from 'react-native';

import MapView from 'react-native-maps';
import {BASE_URL} from '../const';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';

export default class CreateBook extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      title: '',
      description: '',
      user: '',
      images: [],
      dataSourceComments: ds.cloneWithRows([]),
    }
  }

  async componentDidMount() {

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
            <View style={styles.wrInfo}>
              <View style={styles.actionControl}>
                <Text style={styles.title}>{this.state.title}</Text>
                <TouchableHighlight onPress={this.onPressShare.bind(this)}
                  style={styles.actionControlBorrow}>
                  <Image
                    style={styles.actionControlImg}
                    source={this.state.imgBtnControl}
                  />
                </TouchableHighlight>
              </View>
              <Text style={styles.description}>{this.state.description}</Text>
            </View>
            <View style={styles.wrAvatar}>
              <Image
                style={styles.avatar}
                source={{uri: this.state.user.avatar}}
              />
              <Text style={styles.name}>{this.state.user.name}</Text>
            </View>
            <View style={styles.wrComment}>
              <View style={styles.wrCommentLabel}>
                <Text style={styles.wrCommentLabelText}>
                  Comments
                </Text>
                <Icon name="plus-circle" size={30} color="#f7d756"
                  style={styles.wrCommentLabelIcon} onPress={() => {this.refs.modalComment.open();}} />
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
                    onPress={() => {Keyboard.dismiss(); this.refs.modalComment.close()}}
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

const styles = StyleSheet.create({
  backgroundImage: {

  },
});

AppRegistry.registerComponent('CreateBook', () => CreateBook);
