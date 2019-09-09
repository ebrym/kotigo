import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput, 
  TouchableOpacity, 
  AsyncStorage,
  ActivityIndicator,
  View,
  Alert,
  Dimensions,
  Switch,
} from 'react-native';
import { Block, Button, Text, theme,Input } from 'galio-framework';

// import { CheckBox } from 'react-native-elements';
import API  from '../constants/globalURL';
const { height, width } = Dimensions.get('screen');
import materialTheme from '../constants/Theme';
import Loader from '../components/Loader';
import PropTypes from 'prop-types';


export default class RegisterScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            phoneno: "",
            password: "",
            loading: false,
            errors: "",
            validEmail: false,
            validPassword: false,
            checked:false,
        }

        // this.handleEmailChange = this.handleEmailChange.bind(this);
        // this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    componentDidMount(){
        //this._loadInitialState().done();
        //this.setState({loading: false});
    }
    async onRegistrationButtonPress() {
        this.setState({
            loading: true
          });
        try {
           
            let response = await fetch(API.URL + '/User/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    phoneno: this.state.phoneno,
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password
                })
            });            
            //let res = await response.json();
            if(response.status >= 200 && response.status < 300) {

                this.setState({loading: false, error: ""});
                 
                Alert.alert('SignUp Successfull.');
                
                 //console.log("response success is: " + response);
                this.props.navigation.navigate('Login'); 
            } else {

                this.setState({loading: false});
                //let error = res;
                Alert.alert('Error completing signup process!!');
                //throw error;
            }
            //this.setState({loading: false});
        } catch(errors) {
            this.setState({loading: false});
            //console.log("catch errors: " + errors);

            Alert.alert('Error completing signup process. \n please try again later!');
       
        } 
        //this.setState({loading: false});
    }

    toggleSwitch = checked => this.setState({ checked: !this.state.checked });

    handleEmailChange(email) {
        // eslint-disable-next-line
        const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { validEmail } = this.state;
        this.setState({ email: email });
    
        if (!validEmail) {
          if (emailCheckRegex.test(email)) {
            this.setState({ validEmail: true });
          }
        } else if (!emailCheckRegex.test(email)) {
          this.setState({ validEmail: false });
        }
      }
    
      handlePasswordChange(password) {
        const { validPassword } = this.state;
    
        this.setState({ password });
    
        if (!validPassword) {
          if (password.length > 4) {
            // Password has to be at least 4 characters long
            this.setState({ validPassword: true });
          }
        } else if (password <= 4) {
          this.setState({ validPassword: false });
        }
      }
    

    render(){
        // if (this.state.isLoading) {
        //     return (
        //       <View style={styles.container}>
        //         <ActivityIndicator size="large" />
        //       </View>
        //     );
        //   } else {
            // const {
            //      validEmail, validPassword,
            //   } = this.state;
            if(this.state.loading){
                return( 
                  <View style={styles.loader}> 
                    <ActivityIndicator size="large" color="#0c9"/>
                  </View>
              )}
        return(
            <View style = {styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Image
              source={require('../assets/images/kotigo.png')}
              style={styles.welcomeImage}
            />
            <Text style={styles.helpLinkText}>SignUp</Text>
           
                <Input style = {styles.input}  
                    onChangeText={(val) => this.setState({firstname: val})}
                    placeholder='First Name' 
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>
                <Input style = {styles.input}  
                    onChangeText={(val) => this.setState({lastname: val})}
                    placeholder='Last Name' 
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>
                <Input style = {styles.input}  
                    onChangeText={(val) => this.setState({phoneno: val})}
                    placeholder='Phone Number' 
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>

                <Input style = {styles.input} 
                    onChangeText={(val) => this.setState({email: val})}
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    autoCorrect={false} 
                    keyboardType='email-address' 
                    returnKeyType="next" 
                    placeholder='Email Address' 
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    // onChangeText={this.handleEmailChange}
                    // showCheckmark={validEmail}
                    // inputType="email"
                    underlineColorAndroid='transparent'/>   
                <Input style = {styles.input} 
                    onChangeText={(val) => this.setState({username: val})}
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    autoCorrect={false} 
                    returnKeyType="next" 
                    color={materialTheme.COLORS.MAIN}
                    placeholder='Prefered User Name' 
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'/>

                <Input style = {styles.input}
                    onChangeText={(val) => this.setState({password: val})}   
                    returnKeyType="go" 
                    ref={(input)=> this.passwordInput = input} 
                    placeholder='Password' 
                    color={materialTheme.COLORS.MAIN}
                    placeholderTextColor={materialTheme.COLORS.MAIN}
                    underlineColorAndroid='transparent'
                    // onChangeText={this.handlePasswordChange}
                    // showCheckmark={validPassword}
                    // inputType="password"
                    secureTextEntry/>
                     <TouchableOpacity onPress={()=> this.props.navigation.navigate('Terms')} style={styles.helpLink}>
                        <Text style={styles.helpLinkText}>Terms and condition of use.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate('Policy')} style={styles.helpLink}>
                        <Text style={styles.helpLinkText}>Privacy policy</Text>
                    </TouchableOpacity>
                   <Block flex row>
                   <Switch
                    onValueChange={() => this.setState({ checked: !this.state.checked })}
                    ios_backgroundColor={materialTheme.COLORS.SWITCH_OFF}
                    thumbColor={Platform.OS === 'android' ? materialTheme.COLORS.SWITCH_OFF : null}
                    trackColor={{ false: materialTheme.COLORS.SWITCH_OFF, true: materialTheme.COLORS.SWITCH_ON }}
                    value={this.state.checked}/> 
                    <Text>Accept terms and conditions</Text>
                    </Block>
                 {this.state.checked &&(<TouchableOpacity style={styles.buttonContainer} onPress={this.onRegistrationButtonPress.bind(this)}>
                    <Text  style={styles.buttonText}>Register</Text>
                </TouchableOpacity>)}
            </ScrollView> 
         </View>
        );
    }
    //}
}

const Errors = (props) => {
    return (
        <View>
            {props.errors.map((error, i) => <Text key={i} style={styles.error}>{error}</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
  
    helpLinkText:{
        fontSize: 14,
        color: '#2e78b7',
      },
    contentContainer: {
      paddingTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeContainer: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
      alignSelf: 'stretch',
    },
    welcomeImage: {
      width: 100,
      height: 80,
      resizeMode: 'contain',
      marginTop: 3,
      marginLeft: -10,
    },
    helpContainer: {
      marginTop: 15,
      alignItems: 'center',
    },
    helpLink: {
      paddingVertical: 15,
    },
  
  
   
    helpLinkText: {
      fontSize: 14,
      color: materialTheme.COLORS.MAIN,
    },
    input:{
      height: 40,
      backgroundColor: 'rgba(225,225,225,0.2)',
      marginBottom: 10,
      padding: 10,
      color: materialTheme.COLORS.MAIN,
      borderRadius: 25,
      width:300,
      fontSize:16,
  },
  buttonContainer:{
      backgroundColor: materialTheme.COLORS.MAIN,
      paddingVertical: 15,
      borderRadius: 25,
      width:300,
      fontSize:16,
  },
  buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
  },
  error: {
      color: 'red',
      paddingTop: 10
  }
  });
  
