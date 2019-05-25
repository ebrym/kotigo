import React from 'react';
import { Easing, Animated, Platform, AsyncStorage } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';

import { Block, Text, theme } from "galio-framework";

import ComponentsScreen from '../screens/Components';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/Home';
import OnboardingScreen from '../screens/Onboarding';
import ProfileScreen from '../screens/Profile';
import ProScreen from '../screens/Pro';
import SettingsScreen from '../screens/Settings';
import BookListDetails from '../screens/BookListView';
import PaymentScreen from '../screens/PaymentScreen';
import BookShelfScreen from '../screens/LibraryScreen';
import PlayScreen from '../screens/PlayerScreen';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';

import Menu from './Menu';
import Header from '../components/Header';
import { Drawer } from '../components/';

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index
    const width = layout.initWidth
    
    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    })
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1],
    })
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0],
    })

    const scaleWithOpacity = { opacity }
    const screenName = "Search"

    if (screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] }
  }
})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header white transparent title="Profile" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
})

const AccountStack = createStackNavigator({
  Profile: {
    screen: AccountScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header transparent title="My Account" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
})

const SettingStack = createStackNavigator({
  Profile: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header transparent title="Settings" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
})

const BookShelfStach = createStackNavigator({
  BookShelf: {
    screen: BookShelfScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header  transparent title="My Book Shelf" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  Player: {
    screen: PlayScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header back black transparent title="Player" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
})


const ComponentsStack = createStackNavigator({
  Components: {
    screen: ComponentsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header back title="Components" navigation={navigation} />,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
})


const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header search tabs title="Home" navigation={navigation} />,
    }),
  },
  // Settings: {
  //   screen: SettingsScreen,
  //   navigationOptions: ({navigation}) => ({
  //     header: <Header back title="Settings" navigation={navigation} />,
  //   })
  // },
  // Components: {
  //   screen: ComponentsScreen,
  //   navigationOptions: ({navigation}) => ({
  //     header: <Header title="Components" navigation={navigation} />,
  //   })
  // },
  Search: {
    screen: SearchScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black title="Search" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  // Pro: {
  //   screen: ProScreen,
  //   navigationOptions: ({navigation}) => ({
  //     header: <Header back white transparent title="" navigation={navigation} />,
  //     headerTransparent: true,
  //   })
  // },
  BookDetails: {
    screen: BookListDetails,
    navigationOptions: ({navigation}) => ({
      header: <Header back black transparent title="Book Details" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  Payment: {
    screen: PaymentScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black transparent title="Payment" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  
  // BookShelf: {
  //   screen: LibraryScreen,
  //   navigationOptions: ({navigation}) => ({
  //     header: <Header back title="My Book Shelf" navigation={navigation} />,
  //   })
  // },
},
{
  cardStyle: { 
    backgroundColor: '#EEEEEE', //this is the backgroundColor for the app
  },
  transitionConfig,
});

const AppStack = createDrawerNavigator(
  {
    // Onboarding: {
    //   screen: OnboardingScreen,
    //   navigationOptions: {
    //     drawerLabel: () => {},
    //   },
    // },
    Dashboard: {
      screen: HomeStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Home" title="Home" />
        ),
      }),
    },
    // Woman: {
    //   screen: ProScreen,
    //   navigationOptions: (navOpt) => ({
    //     drawerLabel: ({focused}) => (
    //       <Drawer focused={focused} screen="Pro" title="Woman" />
    //     ),
    //   }),
    // },
    // Man: {
    //   screen: ProScreen,
    //   navigationOptions: (navOpt) => ({
    //     drawerLabel: ({focused}) => (
    //       <Drawer focused={focused} screen="Pro" title="Man" />
    //     ),
    //   }),
    // },
    // Kids: {
    //   screen: ProScreen,
    //   navigationOptions: (navOpt) => ({
    //     drawerLabel: ({focused}) => (
    //       <Drawer focused={focused} screen="Pro" title="Kids" />
    //     ),
    //   }),
    // },
    // NewCollection: {
    //   screen: ProScreen,
    //   navigationOptions: (navOpt) => ({
    //     drawerLabel: ({focused}) => (
    //       <Drawer focused={focused} screen="Pro" title="New Collection" />
    //     ),
    //   }),
    // },
    BookShelf: {
      screen: BookShelfStach,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="BookShelfScreen" title="My Book Shelf" />
        ),
      }),
    },
  
    Profile: {
      screen: AccountStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Profile" title="My Account" />
        ),
      }),
    },
    Settings: {
      screen: SettingStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Settings" title="Settings" />
        ),
      }),
    },
    // Components: {
    //   screen: ComponentsStack,
    //   navigationOptions: (navOpt) => ({
    //     drawerLabel: ({focused}) => (
    //       <Drawer focused={focused} screen="Components" title="Components" />
    //     ),
    //   }),
    // },
    MenuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
    SignOut: {
      screen: LoginScreen,
      navigationOptions: (navOpt) => ({
        // addListener: () => {
        //   AsyncStorage.clear(); 
        //   this.props.navigation.navigate('Auth')
        // },
        drawerLabel: ({focused}) => (
          <Drawer focused={focused}  title="Sign Out" />
        ),
      }),
    },
    // SignUp: {
    //   screen: RegisterScreen,
    //   navigationOptions: (navOpt) => ({
    //     drawerLabel: ({focused}) => (
    //       <Drawer focused={focused} screen="Register" title="Sign Up" />
    //     ),
    //   }),
    // },
    MenuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
    Help: {
      screen: RegisterScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="" title="Help and Support" />
        ),
      }),
    },
    About: {
      screen: RegisterScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="" title="About" />
        ),
      }),
    },
  },
  Menu
);
const AuthStack = createStackNavigator({ Login: LoginScreen, 
  Register : RegisterScreen});

export default createSwitchNavigator(
  {
    Auth:AuthStack,
    App: AppStack,
    Home: HomeStack,
  },
  {
    initialRouteName: 'Auth',
  }
);