import React from 'react';
import { StyleSheet, Switch, FlatList, Platform, TouchableOpacity, ScrollView } from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";

import materialTheme from '../constants/Theme';

export default class Support extends React.Component {
  state = {};

  toggleSwitch = switchNumber => this.setState({ [switchNumber]: !this.state[switchNumber] });
  async onLogutPress() {
    AsyncStorage.clear(); // to clear the token 
    this.setState({loggedIn:false});
    this.props.navigation.navigate('Auth')
    }
  renderItem = ({ item }) => {
    const {navigate} = this.props.navigation;

    switch(item.type) {
      case 'switch': 
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text size={15}>{item.title}</Text>
            <Switch
              onValueChange={() => this.toggleSwitch(item.id)}
              ios_backgroundColor={materialTheme.COLORS.SWITCH_OFF}
              thumbColor={Platform.OS === 'android' ? materialTheme.COLORS.SWITCH_OFF : null}
              trackColor={{ false: materialTheme.COLORS.SWITCH_OFF, true: materialTheme.COLORS.SWITCH_ON }}
              value={this.state[item.id]}
            />
          </Block>
        );
      case 'button': 
        return (
          <Block style={styles.rows}>
            <TouchableOpacity onPress={() => navigate('Pro')}>
              <Block row middle space="between" style={{paddingTop:7}}>
                <Text size={15}>{item.title}</Text>
                <Icon name="stre-right" family="Galio" style={{ paddingRight: 5 }} />
              </Block>
            </TouchableOpacity>
          </Block>);
      default:
        break;
    }
  }

  render() {
    // const recommended = [
    //   { title: "Use FaceID to sign in", id: "face", type: "switch" },
    //   { title: "Auto-Lock security", id: "autolock", type: "switch" },
    //   { title: "Notifications", id: "Notifications", type: "button" },
    // ];

    const payment = [
      { title: "Manage Payment Options", id: "Payment", type: "button" },
      { title: "Manage Gift Cards", id: "gift", type: "button" },
    ];
    
    const privacy = [
      { title: "User Agreement", id: "Agreement", type: "button" },
      { title: "Privacy", id: "Privacy", type: "button" },
      { title: "About", id: "About", type: "button" },
    ];

    return (
      <Block flex style={styles.options}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settings}>
   
        <Block style={styles.title}>
          <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
          Help and Support
          </Text>
          {/* <Text center muted size={12}>
          
          </Text> */}
        </Block>
        <Block style={styles.rows}>
              <Block left space="between" style={{paddingTop:7}}>
                <Text size={13} >Have a question? Please contact Kotigo Team</Text>
                <Text size={13} >Call Us: (234) 0 909 0123 512</Text>
                <Text size={13} >Email Us: support@MyKotigo.com</Text>
              </Block>
        </Block>
        <Block style={styles.title}>
          <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
          Contact
          </Text>
          {/* <Text center muted size={12}>
          Third most important settings
          </Text> */}<Block left >
                <Text size={15} bold underline >More Contact Information</Text>
                <Text size={13} style={{flex: 1, flexWrap: 'wrap'}} >For More Information, please visit www.mykotigo.com</Text>
                <Text size={13}  style={{flex: 1, flexWrap: 'wrap'}}  >Email Us: info@mykotigo.com</Text>
                <Text size={13} style={{flex: 1, flexWrap: 'wrap'}} >Connect with us on Social Media Channels</Text>
                <Text size={13} style={{flex: 1, flexWrap: 'wrap'}}>(Facebook, Instagram, Twitter):  @MyKotigo</Text>
              </Block>
        </Block>
    
      </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE * 2,
    marginBottom: theme.SIZES.BASE,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
});
