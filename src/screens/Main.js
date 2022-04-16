import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import database, {firebase} from '@react-native-firebase/database';
import {cloneDeep} from 'lodash';

import {COLORS} from '../components/shared/colors';
import {randomIdGenerator} from '../components/common/CommonFunction';

const productReference = firebase
  .app()
  .database('https://addmultiproductdemo-default-rtdb.firebaseio.com/')
  .ref('/');

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addOrEditModalOpen: false,
      edit: false,
      title: '',
      price: '',
      offerPrice: '',
      productDetails: [],
      currentPressedItem: {},

      errors: {
        title: '',
        price: '',
        offerPrice: '',
      },
    };
  }

  componentDidMount() {
    let arr = [];
    productReference.once('value', snapshot => {
      snapshot.forEach(item => {
        arr.push(item.val());
      });
      this.setState({
        productDetails: arr,
      });
    });
  }

  createValidation = () => {
    let isValid = true;

    if (this.state.title === '') {
      this.setState({
        errors: {...this.state.errors, title: 'Product name cannot be empty'},
      });
      isValid = false;
    } else if (this.state.price === '') {
      this.setState({
        errors: {...this.state.errors, price: 'Price cannot be empty'},
      });
      isValid = false;
    } else if (this.state.offerPrice === '') {
      this.setState({
        errors: {
          ...this.state.errors,
          offerPrice: 'Offer Price cannot be empty',
        },
      });
      isValid = false;
    }

    setTimeout(() => {
      this.setState({
        errors: {...this.state.errors, title: '', price: '', offerPrice: ''},
      });
    }, 2000);
    return isValid;
  };

  deleteProduct = () => {
    let tempProductDetails = cloneDeep(this.state.productDetails);
    let tempIndex = tempProductDetails.findIndex(
      x => x.id === this.state.currentPressedItem.id,
    );
    tempProductDetails.splice(tempIndex, 1);

    productReference
      .child(this.state.currentPressedItem.id)
      .set(null)
      .then(() =>
        this.setState({
          productDetails: tempProductDetails,
        }),
      )
      .catch(err => console.log(err));
  };

  editProduct = () => {
    let postBody = {
      id: this.state.currentPressedItem.id,
      name: this.state.title,
      price: this.state.price.trim(),
      offerPrice: this.state.offerPrice.trim(),
    };

    if (this.createValidation()) {
      let tempProductDetails = cloneDeep(this.state.productDetails);
      let tempIndex = tempProductDetails.findIndex(x => x.id === postBody.id);
      tempProductDetails[tempIndex] = postBody;

      productReference
        .child(postBody.id)
        .set(postBody)
        .then(() =>
          this.setState({
            addOrEditModalOpen: false,
            productDetails: tempProductDetails,
            title: '',
            price: '',
            offerPrice: '',
            edit: false,
          }),
        )
        .catch(err => console.log(err));
    }
  };

  createProduct = () => {
    let postBody = {
      id: randomIdGenerator(6) + Date.now().toString(),
      name: this.state.title,
      price: this.state.price.trim(),
      offerPrice: this.state.offerPrice.trim(),
    };

    if (this.createValidation()) {
      productReference
        .child(postBody.id)
        .set(postBody)
        .then(() =>
          this.setState({
            addOrEditModalOpen: false,
            productDetails: this.state.productDetails.concat(postBody),
            title: '',
            price: '',
            offerPrice: '',
          }),
        )
        .catch(err => console.log(err));
    }
  };

  addOrEditModal = () => {
    let {errors} = this.state;
    return (
      <Modal
        isVisible={this.state.addOrEditModalOpen}
        animationIn="slideInUp"
        avoidKeyboard
        backdropColor={COLORS.black}
        onSwipeComplete={() =>
          this.setState({
            addOrEditModalOpen: false,
            edit: false,
            title: '',
            price: '',
            offerPrice: '',
          })
        }
        swipeDirection="down"
        useNativeDriverForBackdrop
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.swipeDownIcon}></View>
        <View style={styles.modalCard}>
          <View style={styles.rowViewSpaceBetween}>
            <View style={{width: '70%'}}>
              <Text
                style={[
                  styles.productName,
                  {
                    color:
                      errors?.title !== '' ? COLORS.alert_red : COLORS.grey_500,
                  },
                ]}>
                {errors?.title !== '' ? errors.title : 'Product name'}
              </Text>
              <TextInput
                placeholder="write here ..."
                selectionColor={COLORS.grey_500}
                onChangeText={value => this.setState({title: value})}
                value={this.state.title}
                style={[
                  styles.inputBox,
                  {
                    marginTop: Platform.OS === 'ios' ? 10 : 0,
                    marginLeft: Platform.OS === 'ios' ? 4 : 0,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              onPress={this.state.edit ? this.editProduct : this.createProduct}
              activeOpacity={0.5}
              style={styles.doneBtn}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowViewSpaceBetween}>
            <View style={{width: '70%'}}>
              <Text
                style={[
                  styles.productName,
                  {
                    color:
                      errors?.price !== '' ? COLORS.alert_red : COLORS.grey_500,
                    marginTop: 12,
                  },
                ]}>
                {errors?.price !== '' ? errors.price : 'Price'}
              </Text>
              <TextInput
                placeholder="write here ..."
                selectionColor={COLORS.grey_500}
                onChangeText={value => this.setState({price: value.toString()})}
                value={this.state.price.toString()}
                style={[
                  styles.inputBox,
                  {
                    marginTop: Platform.OS === 'ios' ? 10 : 0,
                    marginLeft: Platform.OS === 'ios' ? 4 : 0,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.rowViewSpaceBetween}>
            <View style={{width: '70%'}}>
              <Text
                style={[
                  styles.productName,
                  {
                    color:
                      errors?.offerPrice !== ''
                        ? COLORS.alert_red
                        : COLORS.grey_500,
                    marginTop: 12,
                  },
                ]}>
                {errors?.offerPrice !== '' ? errors.offerPrice : 'Offer Price'}
              </Text>
              <TextInput
                placeholder="write here ..."
                selectionColor={COLORS.grey_500}
                onChangeText={value =>
                  this.setState({offerPrice: value.toString()})
                }
                value={this.state.offerPrice.toString()}
                style={[
                  styles.inputBox,
                  {
                    marginTop: Platform.OS === 'ios' ? 10 : 0,
                    marginLeft: Platform.OS === 'ios' ? 4 : 0,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderProductItem = (item, index) => {
    return (
      <View style={{paddingHorizontal: 15, marginTop: 12}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name="phone-portrait-outline"
              size={16}
              color={COLORS.primary_green}
            />
            <View>
              <Text
                style={{
                  marginLeft: 6,
                  fontWeight: '700',
                  fontSize: 16,
                  color: COLORS.primary_green,
                }}>
                {item.name}
              </Text>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    marginLeft: 6,
                    fontWeight: '500',
                    fontSize: 12,
                    color: COLORS.grey_400,
                    textDecorationLine: 'line-through',
                  }}>
                  {'$' + item.price}
                </Text>
                <Text
                  style={{
                    marginLeft: 6,
                    fontWeight: '500',
                    fontSize: 12,
                    color: COLORS.grey_400,
                  }}>
                  {'$' + item.offerPrice}
                </Text>
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  currentPressedItem: item,
                  edit: true,
                  title: item.name,
                  price: item.price,
                  offerPrice: item.offerPrice,
                  addOrEditModalOpen: true,
                })
              }
              style={{
                height: 20,
                width: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="edit" size={16} color={COLORS.yellow} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.setState({currentPressedItem: item}, () => {
                  this.deleteProduct();
                })
              }
              style={{
                height: 20,
                width: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Icon name="trash-o" size={16} color={COLORS.orange} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.addOrEditModal()}

        <FlatList
          data={this.state.productDetails}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => this.renderProductItem(item, index)}
        />

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.addBtn}
          onPress={() =>
            this.setState({addOrEditModalOpen: true, edit: false})
          }>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: COLORS.white}}>
            +
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    borderRadius: 10,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.yellow,
    shadowColor: COLORS.yellow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  modalCard: {
    height: '60%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 15,
  },
  swipeDownIcon: {
    width: 30,
    height: 6,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 20,
  },
  rowViewSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doneBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: COLORS.orange,
    shadowColor: COLORS.yellow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  doneText: {
    color: COLORS.white,
  },
  productName: {
    marginTop: 40,
    marginBottom: -10,
    marginLeft: 3,
    fontSize: 11,
  },
  inputBox: {
    fontSize: 18,
    color: COLORS.black,
  },
});
