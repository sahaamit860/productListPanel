import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Component} from 'react';

import Main from '../screens/Main';

const Stack = createNativeStackNavigator();

class MainStackNavigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gesturesEnabled: true,
            animationEnabled: true,
            gestureDirection: 'horizontal',
          }}>
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default MainStackNavigator;
