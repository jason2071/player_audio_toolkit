import React from 'react';
import {View} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';

import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Home from '../screens/Home';
import Person from '../screens/Person';
// import Sound from '../components/Audio';
import Sound from '../components/Toolkit';

const TabBarComponent = (props) => <BottomTabBar {...props} />;

const BottomTabsStack = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Octicons name="home" size={25} color={tintColor} />
        ),
      },
    },
    Person: {
      screen: Person,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <AntDesign name="user" size={25} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#e84a5f',
      inactiveTintColor: '#8e8e8e',
    },
    tabBarComponent: (props) => (
      <View>
        <Sound />
        <TabBarComponent {...props} style={{borderTopColor: '#605F60'}} />
      </View>
    ),
  },
);

export default createAppContainer(createSwitchNavigator({BottomTabsStack}));
