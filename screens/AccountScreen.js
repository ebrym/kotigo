import React from "react";
import { View,StyleSheet,ScrollView,Dimensions,
    TouchableOpacity,ImageBackground, Platform,
     Icon, Image, Slider,Alert,AsyncStorage} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
  import { Audio } from "expo";
  import { Ionicons } from '@expo/vector-icons';

  import { API } from '../constants/globalURL';
  import { HeaderHeight } from "../constants/utils";
  import {Recorder, Player} from 'react-native-audio-player-recorder-no-linking';


  const { width, height } = Dimensions.get('screen');
  const thumbMeasure = (width - 48 - 32) / 3;

const ACCESS_TOKEN = 'access_token';
  export default class AccountScreen extends React.Component {
   
      constructor(props) {
        super(props);
      }

      async onLogutPress() {
        AsyncStorage.clear(); // to clear the token 
        this.setState({loggedIn:false});
        this.props.navigation.navigate('Auth')
        }



    render() {
        const userDetails = JSON.parse(global.userDetails);
        return (
       
        <Block flex style={styles.options}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text bold size={16} style={styles.title}>Profile Details</Text>
               
                  <Block style={styles.categoryTitle}>
                  <Text style = {styles.input} >First Name : {userDetails.FirstName}</Text>
            <Text style = {styles.input} >Last Name : {userDetails.LastName}</Text>
            <Text style = {styles.input} >UserName : {userDetails.Username}</Text>
            <Text style = {styles.input} >Email : {userDetails.Email}</Text>

            <Text style = {styles.input}
                onChangeText={(val) => this.setState({password: val})}   
                returnKeyType="go" 
                ref={(input)=> this.passwordInput = input} 
                placeholder='Password' 
                placeholderTextColor='#2e78b7' 
                underlineColorAndroid='transparent'
                secureTextEntry/>

            <TouchableOpacity style={styles.pro} onPress={this.onLogutPress.bind(this)}>
                <Text  style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </Block>
        </ScrollView>
     
          

      </Block>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      paddingTop: 30,
    },
    profile: {
      marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
      marginBottom: -HeaderHeight * 2,
    },
    profileImage: {
      width: width * 1.1,
      height: 'auto',
    },
    profileContainer: {
      width: width,
      height: height / 2,
    },
    profileDetails: {
      paddingTop: theme.SIZES.BASE * 4,
      justifyContent: 'flex-end',
      position: 'relative',
    },
    profileTexts: {
      paddingHorizontal: theme.SIZES.BASE * 2,
      paddingVertical: theme.SIZES.BASE * 2,
      zIndex: 2
    },
    pro: {
      backgroundColor: materialTheme.COLORS.BUTTON_COLOR,
      paddingHorizontal: 6,
      marginRight: theme.SIZES.BASE / 2,
      borderRadius: 4,
      width:70
    },
    title: {
      paddingVertical: theme.SIZES.BASE,
      paddingHorizontal: theme.SIZES.BASE * 2,
      color:theme.COLORS.BUTTON_COLOR
    },
    group: {
      paddingTop: theme.SIZES.BASE * 3.75,
    },
    shadow: {
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.2,
      elevation: 2,
    },
    parent: {
      width: '100%', 
      flexDirection: 'row', 
      flexWrap: 'wrap'
  },
  child: {
      width: '48%', 
      margin: '1%', 
      aspectRatio: 1,
  },
  card:{
    backgroundColor:'#fff',
    marginBottom:10,
    marginLeft:'2%',
    width: '46%', 
    aspectRatio: 1,
    shadowColor:'#000',
    shadowOpacity:0.2,
    shadowRadius:1,
    shadowOffset:{
      width:3,
      height:3
    }
  },
  cardImage:{
    width:'100%',
    height:'90%',
    resizeMode:'stretch'
  },
  cardText : {
    padding:5,
    fontSize:10
  },cardTextTiny : {
    padding:5,
    fontSize:8
  },list: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cardViewStyle:{
   
    width: '98%',
    height:'90%',
  
  },
  
  cardView_InsideText:{
    fontSize: 20, 
    color: '#000', 
    textAlign: 'center', 
    marginTop: 50    
  
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: Platform.OS === 'android' ? theme.SIZES.BASE : theme.SIZES.BASE * 7,
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
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
  });
  