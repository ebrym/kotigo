import React from 'react';
import { createAppContainer,createStackNavigator, createSwitchNavigator } from 'react-navigation';



import LibraryScreen from '../screens/LibraryScreen';
import PlayerScreen from '../screens/PlayerScreen';

const OfflineStack = createStackNavigator({ Library: LibraryScreen, 
  Player : PlayerScreen});
// const BookStack = createStackNavigator({ Home: HomeScreen, 
//     });

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html


  Main: OfflineStack,
  //BookDetails:BookListDetails,
});
