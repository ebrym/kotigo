import React from 'react';
import { Easing, Animated, Platform, AsyncStorage } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';

import { Block, Text, theme } from "galio-framework";

import ComponentsScreen from '../screens/Components';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetAccountScreen from '../screens/ResetAccountScreen';
import HomeScreen from '../screens/Home';
import OnboardingScreen from '../screens/Onboarding';
import ProfileScreen from '../screens/Profile';
import ProScreen from '../screens/Pro';
import SettingsScreen from '../screens/Settings';
import BookListDetails from '../screens/BookListView';
import PaymentScreen from '../screens/PaymentScreen';
import PaystackPaymentScreen from '../screens/PaystackPaymentScreen';
import FlutterPaymentScreen from '../screens/FlutterPaymentScreen';
import BookShelfScreen from '../screens/LibraryScreen';
import PlayScreen from '../screens/PlayerScreen';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';
import CategoryScreen from '../screens/BookCategoryScreen';
import GenreScreen from '../screens/BookGenreScreen';


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




const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header search title="Home" navigation={navigation} />,
    }),
  },

  Search: {
    screen: SearchScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black title="Search" navigation={navigation} />,
      headerTransparent: true,
    })
  },

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
      header: <Header back black transparent title="Payment Details" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  PayStackPayment: {
    screen: PaystackPaymentScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black transparent title="Pay with PayStack" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  FlutterPayment: {
    screen: FlutterPaymentScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black transparent title="Pay with Flutter" navigation={navigation} />,
      headerTransparent: true,
    })
  },

},
{
  cardStyle: { 
    backgroundColor: '#EEEEEE', //this is the backgroundColor for the app
  },
  transitionConfig,
});


const CategoryStack = createStackNavigator({
  Category: {
    screen: CategoryScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header tabs title="Category" navigation={navigation} />,
    }),
  },
  Genre: {
    screen: GenreScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header tabs title="Genre" navigation={navigation} />,
    }),
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black title="Search" navigation={navigation} />,
      headerTransparent: true,
    })
  },

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
      header: <Header back black transparent title="Payment Details" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  PayStackPayment: {
    screen: PaystackPaymentScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black transparent title="Pay with PayStack" navigation={navigation} />,
      headerTransparent: true,
    })
  },
  FlutterPayment: {
    screen: FlutterPaymentScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back black transparent title="Pay with Flutter" navigation={navigation} />,
      headerTransparent: true,
    })
  },

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
    Category: {
      screen: CategoryStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="BookCaategoryScreen" title="Browse Category" />
        ),
      }),
    },
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

    MenuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
    SignOut: {
      screen: LoginScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused}  title="Sign Out" onPress={() => {
            AsyncStorage.clear(); // to clear the token 
            this.props.navigation.navigate('Auth');
          }}/>
        ),
       
      }),
      
    },

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
const AuthStack = createStackNavigator({ 
  Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    ResetAccount: {
      screen: ResetAccountScreen,
    },
  // Login: LoginScreen, 
  // Register : RegisterScreen, ResetAccount : ResetAccountScreen
});

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