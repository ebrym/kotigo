import React from "react";
import { View,StyleSheet,ScrollView,Dimensions,TextInput,
    TouchableOpacity,ImageBackground, Platform,ActivityIndicator,
  Animated,Keyboard,UIManager,
     Icon, Image, Slider,Alert,AsyncStorage} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
 

  import { Images, materialTheme } from '../constants';

  import API from '../constants/globalURL';
  import { HeaderHeight } from "../constants/utils";



  const { State: TextInputState } = TextInput;
  const { width, height } = Dimensions.get('screen');
  const thumbMeasure = (width - 48 - 32) / 3;

const ACCESS_TOKEN = 'access_token';
  export default class AccountScreen extends React.Component {
   
      constructor(props) {
        super(props);
        this.state = {
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          phoneno: '',
          password: '',
          loading: false,
          errors: "",
          validEmail: false,
          validPassword: false,
          checked:false,
          shift: new Animated.Value(0),
      }
      }
componentDidMount(){
  // const userDetails = JSON.parse(global.userDetails);
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
   console.log(global.userDetails);
  const userDet = JSON.parse(global.userDetails);


  this.setState( {
    firstname: userDet.FirstName,
    lastname: userDet.LastName,
    username: userDet.Username,
    email: userDet.Email,
    phoneno: userDet.PhoneNo,
});
}
      async onLogutPress() {
        AsyncStorage.clear(); // to clear the token 
        this.setState({loggedIn:false});
        this.props.navigation.navigate('Auth')
        }

    async onUpdateProfilePress() {
      const user = JSON.parse(global.userDetails);
          this.setState({
              loading: true
            });
          try {
            let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
              let response = await fetch(API.URL + '/User/'+ user.Id, {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': "application/json",
                      'Authorization': 'Bearer ' + token,
                  },
                  body: JSON.stringify({
                      firstname: this.state.firstname,
                      lastname: this.state.lastname,
                      phoneno: this.state.phoneno,
                      email: this.state.email,
                      username: this.state.username
                  })
              });            
              //let res = await response.json();
              if(response.status >= 200 && response.status < 300) {
  
                  this.setState({loading: false, error: ""});
                   
                  Alert.alert('profile update Successfull.');

                

                  const newUser = {
                    Id: user.Id,
                    Username:this.state.username,
                    FirstName:this.state.firstname,
                    LastName:this.state.lastname,
                    Email:this.state.email,
                    PhoneNo:this.state.phoneno,
                    access_token:user.access_token,
                    expires: user.expires
                  };
                  var testuser = JSON.stringify(newUser);
                  AsyncStorage.setItem('UserDetails', testuser);
                  global.userDetails = testuser;
               
              } else {
  
                  this.setState({loading: false});
                  //let error = res;
                  Alert.alert('Error updating profile!!');
                  //throw error;
              }
              //this.setState({loading: false});
          } catch(errors) {
              this.setState({loading: false});
              console.log("catch errors: " + errors);
  
              Alert.alert('cannot update profile at this time, please try again later!');
         
          } 
          //this.setState({loading: false});
      }
      componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
      }
      handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
          if (gap >= 0) {
            return;
          }
          Animated.timing(
            this.state.shift,
            {
              toValue: gap,
              duration: 1000,
              useNativeDriver: true,
            }
          ).start();
        });
      }
      handleKeyboardDidHide = () => {
        Animated.timing(
          this.state.shift,
          {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }
        ).start();
      }
    
    render() {
      const { shift } = this.state;
      //const userDetails = JSON.parse(global.userDetails);
        if(this.state.loading){
          return( 
            <View style={styles.loader}> 
              <ActivityIndicator size="large" color="#0c9"/>
            </View>
        )}
      //   const userDet = JSON.parse(global.userDetails);
      //   this.setState( {
      //     firstname: userDet.FirstName,
      //     lastname: userDet.Lastname,
      //     username: userDet.Username,
      //     email: userDet.Email,
      //     phoneno: userDet.PhoneNo,
      // });

        return (
          <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
        <Block flex style={styles.options}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text bold size={16} style={styles.title}>Profile Details</Text>
               
                  <Block style={styles.categoryTitle}>
           
            <Text style = {styles.input} >First Name :</Text>
            <Input style = {styles.input}  
                    defaultValue={this.state.firstname}
                    onChangeText={(val) => this.setState({firstname: String(val)})}
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>
             <Text style = {styles.input} >Last Name : </Text>
                <Input style = {styles.input}
                    defaultValue={this.state.lastname}
                    onChangeText={(val) => this.setState({lastname:val})}
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>
                <Text style = {styles.input} >Phone : </Text>
                <Input style = {styles.input} 
                    defaultValue={this.state.phoneno}
                    onChangeText={(val) => this.setState({phoneno: val})}
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>
                <Text style = {styles.input} >Email : </Text>
                <Input style = {styles.input} 
                    value={this.state.email}
                    onChangeText={(val) => this.setState({email: val})}
                    autoCapitalize="none" 
                    autoCorrect={false} 
                    returnKeyType="next" 
                    editable={false}
                    placeholder='Email Address' 
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>  
                <Text style = {styles.input} >UserName : </Text> 
                <Input style = {styles.input} 
                   defaultValue={this.state.username}
                    onChangeText={(val) => this.setState({username: val})}
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    autoCorrect={false} 
                    returnKeyType="next" 
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>

              <Block row flex space="between">
          
                <TouchableOpacity style={styles.buttonContainer} onPress={this.onUpdateProfilePress.bind(this)}>
                            <Text  style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.buttonLogout} onPress={this.onLogutPress.bind(this)}>
                    <Text  style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              {/* </Block>
              <Block right> */}
                
            {/* <TouchableOpacity style={styles.buttonContainer} onPress={this.onLogutPress.bind(this)}>
                <Text  style={styles.buttonText}>Reset Account</Text>
            </TouchableOpacity> */}
              

              </Block>

            {/* <Block flex row center> 
                
              </Block> */}


        </Block>
        </ScrollView>
     
          

      </Block>
      </Animated.View>
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
  buttonContainer:{
    backgroundColor: materialTheme.COLORS.MAIN,
    paddingVertical: 15,
    borderRadius: 25,
    width:150,
    fontSize:16,
},
buttonLogout:{
  backgroundColor: materialTheme.COLORS.MAIN,
  paddingVertical: 15,
  borderRadius: 25,
  width:80,
  fontSize:16,
},
buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
},
  });
  