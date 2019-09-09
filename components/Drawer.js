import React from 'react';
import { StyleSheet, Platform,AsyncStorage,TouchableOpacity } from 'react-native';
import { Block, Text, theme } from "galio-framework";

import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import Icon from './Icon';
import materialTheme from '../constants/Theme';

const proScreens = ['Woman', 'Man', 'Kids', 'New Collection', 'Sign In', 'Sign Up'];

class DrawerItem extends React.Component  {
  constructor(props){
    super(props);
  }
  renderIcon = () => {
    const { title, focused, signOut } = this.props;

    switch (title) {
      case 'Home':
        return (
          <Icon
            size={16}
            name="shop"
            family="GalioExtra"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />
        );
      
      case 'Browse':
        return (
          <Icon
            size={16}
            name="zoom-split"
            family="Galio"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />
        );
      // case 'Man':
      //   return (
      //     <Icon
      //       size={16}
      //       name="users-mm"
      //       family="Galio"
      //       color={focused ? 'white' : materialTheme.COLORS.MUTED} />
      //   );
      // case 'Help and Support':
      //   return (
      //     <Ionicons
      //       size={16}
      //       name={Platform.OS === 'ios' ? 'ios-help' : 'md-help'}
      //       family="GalioExtra"
      //       color={focused ? 'white' : materialTheme.COLORS.MUTED} />
      //   );
      case 'My Audiobooks':
        return (
          <Ionicons
            size={16}
            name={Platform.OS === 'ios' ? 'ios-book' : 'md-book'}
            family="Galio"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />
        );
      case 'My Account':
        return (
          <Icon
            size={16}
            name="circle-10"
            family="GalioExtra"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />
        );
      case 'Settings':
        return (
          <Icon
            size={16}
            name="flower-06"
            family="Galio"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />
        );
      case 'Help and Support':
        return (
          <Icon
            size={16}
            name="ui-04"
            family="Galio"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />

           
        );
      case 'Sign Out':
        return (
          // <Icon
          //   size={16}
          //   name="log-in"
          //   family="Galio"
          //   color={focused ? 'white' : materialTheme.COLORS.MUTED} />

            // <TouchableOpacity style={[styles.button]} onPress={() => {
            //   console.log("logout");
            //   AsyncStorage.clear();
            //   this.setState({loggedIn:false});
            //   this.navigation.navigate('App');}
            //   }>
            <Icon
               size={16}
               name="log-in"
               family="Galio"
               color={focused ? 'white' : materialTheme.COLORS.MUTED} signOut />   
        
        );
      case 'About':
        return (
          <Icon
            size={16}
            name="add-27"
            family="Galio"
            color={focused ? 'white' : materialTheme.COLORS.MUTED} />
        );
      default:
        return null;
    }
  }

  renderLabel = () => {
    //const { title } = this.props;
    const { focused, title,navigation } = this.props;
    const proScreen = proScreens.includes(title);
    if (title =='Sign Out') {
      return (
        <TouchableOpacity onPress={() => {
          AsyncStorage.clear();
         // this.setState({loggedIn:false});
          //navigation.navigate('App');
        }
          }> 
        <Text size={18} color={focused ? 'white' : proScreen ? materialTheme.COLORS.MUTED : 'black'}>
        {title}
      </Text>
      </TouchableOpacity>
      )
    }else{
      return (  <Text size={18} color={focused ? 'white' : proScreen ? materialTheme.COLORS.MUTED : 'black'}>
      {title}
    </Text>
      )
      }
    }

  //   return null;
  // }
  // async onLogutPress() {
  //   AsyncStorage.clear(); // to clear the token 
  //   this.setState({loggedIn:false});
  //   this.props.navigation.navigate('Auth')
  //   }
  render() {
    const { focused, title } = this.props;

    const proScreen = proScreens.includes(title);
    // if (title==='Sign Out') {
    //   return(  <TouchableOpacity style={[styles.button]} onPress={() => {
    //               // console.log("logout");
    //               AsyncStorage.clear();
    //               this.setState({loggedIn:false});
    //               this.navigation.navigate('App');}
    //               }> 
    //           <Block flex row style={[styles.defaultStyle, focused ? [styles.activeStyle, styles.shadow] : null]}>
    //             <Block middle flex={0.1} style={{ marginRight: 28 }}>
    //               {this.renderIcon()}
    //             </Block>
    //             <Block row center flex={0.9}>
    //               <Text size={18} color={focused ? 'white' : proScreen ? materialTheme.COLORS.MUTED : 'black'}>
    //             {title} 
                 
    //               </Text>
    //             </Block>
    //         </Block> 
    //         </TouchableOpacity>
    //       );
    // }else{

    
    return (
      <Block flex row style={[styles.defaultStyle, focused ? [styles.activeStyle, styles.shadow] : null]}>
        <Block middle flex={0.1} style={{ marginRight: 28 }}>
          {this.renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          {/* <Text size={18} color={focused ? 'white' : proScreen ? materialTheme.COLORS.MUTED : 'black'}>
            {title}
          </Text> */}
          {this.renderLabel()}
        </Block>
      </Block>
    );
   // }
  }
}

export default withNavigation(DrawerItem);

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderRadius: 2,
    height: 16,
    width: 36,
  },
})