import React from 'react';
import { StyleSheet, Switch, FlatList, Platform, TouchableOpacity, ScrollView, Image } from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";

import materialTheme from '../constants/Theme';
import { HeaderHeight } from "../constants/utils";
import { Ionicons } from '@expo/vector-icons';

export default class About extends React.Component {
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
            <Text size={14}>{item.title}</Text>
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
            <TouchableOpacity onPress={() => navigate(item.display)}>
              <Block row left space="between" style={{paddingTop:7}}>
                <Text size={14}>{item.title}</Text>
            <Ionicons 
            //name="ios-arrow-forward" 
            name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-dropright'}
            family="Galio" style={{ paddingRight: 5 }} />
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
    const privacy = [
      { title: "Terms of use", id: "Agreement", type: "button", display: "Terms" },
      { title: "Privacy Policy", id: "Privacy", type: "button", display: "Policy"  },
      // { title: "About", id: "About", type: "button", display: "About"  },
    ];
    const payment = [
      { title: "Manage Payment Options", id: "Payment", type: "button" },
      { title: "Manage Gift Cards", id: "gift", type: "button" },
    ];
    

    return (
      <Block flex style={styles.options}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settings}>
          <Block flex center><Image
              source={require('../assets/images/kotigo.png')}
              style={styles.welcomeImage}
            />
            </Block>
        <Block style={styles.title}>
          {/* <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
         About
          </Text> */}
          <Text center muted size={13}>
          Knowledge on the go.
          </Text>
        
        </Block>
        <Block style={styles.rows}>
              <Block center space="between" style={{paddingTop:7}}>
                <Text size={15} bold center size={theme.SIZES.BASE} >About Kotigo</Text>
                <Text size={13} style={{flex: 1, flexWrap: 'wrap'}} center >KOTIGO the preeminent audiobook platform for Africa's independent authors and publishers</Text>
                <Text size={13} center>Version 1.2.5 (Build 34578)</Text>
                <Text size={13} center>©2019</Text>
              </Block>
        </Block>
       
      <Block style={styles.title}>
          <Text bold center size={theme.SIZES.BASE} style={{ paddingTop:70 }}>
          Policies
          </Text>
          {/* <Text center muted size={12}>
          Terms of use and privacy policy
          </Text> */}
        </Block>
        <FlatList
          data={privacy}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
        {/* <Text size={12} center> </Text>
        <Text size={12} center> </Text>
        <Text size={12} center> </Text>
        <Text size={12} center> </Text>
        <Text size={12} center> </Text>
        <Text size={12} center> </Text>
        <Text size={12} center> </Text> */}
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
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
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
