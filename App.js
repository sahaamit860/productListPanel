import React, {Component} from 'react';
import {Text} from 'react-native';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import MainStackNavigator from './src/navigation/MainStackNavigator';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    Ionicons.loadFont();
    Icon.loadFont();

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  render() {
    return <MainStackNavigator />;
  }
}
