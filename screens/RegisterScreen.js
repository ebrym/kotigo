import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text, 
  TextInput, 
  TouchableOpacity, 
  AsyncStorage,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';

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
            errors: ""
        }
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
           
            let response = await fetch('http://216.10.247.42:8089/api/User/register', {
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
                //this.props.navigation.navigate('Login'); 
            } else {

                this.setState({loading: false});
                let error = res;
                Alert.alert('Error completing signup process!!');
                throw error;
            }
            //this.setState({loading: false});
        } catch(errors) {
            this.setState({loading: false});
            console.log("catch errors: " + errors);

            Alert.alert('Error completing signup process. \n please try again later!');
            //let formErrors = JSON.parse(errors);
            // let errorsArray = [];
            // for(let key in formErrors) {
            //     if(formErrors[key].length > 1){
            //         formErrors[key].map(error => errorsArray.push(`${key} ${error}`))
            //     } else {
            //         errorsArray.push(`${key} ${formErrors[key]}`)
            //     }
            // }
            // this.setState({errors: errorsArray});
        } 
        //this.setState({loading: false});
    }

    render(){
        // if (this.state.isLoading) {
        //     return (
        //       <View style={styles.container}>
        //         <ActivityIndicator size="large" />
        //       </View>
        //     );
        //   } else {
        return(
            <View style = {styles.container}>
               

               <Loader
          loading={this.state.loading} />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            
            <Image
              source={require('../assets/images/gosmarticlelogo.png')
              }
              style={styles.welcomeImage}
            />
            <Text style={styles.helpLinkText}>SignUp</Text>
           
                <TextInput style = {styles.input}  
                    onChangeText={(val) => this.setState({firstname: val})}
                    placeholder='First Name' 
                    placeholderTextColor='#2e78b7'
                    underlineColorAndroid='transparent'/>
                <TextInput style = {styles.input}  
                    onChangeText={(val) => this.setState({lastname: val})}
                    placeholder='Last Name' 
                    placeholderTextColor='#2e78b7'
                    underlineColorAndroid='transparent'/>
                <TextInput style = {styles.input}  
                    onChangeText={(val) => this.setState({phoneno: val})}
                    placeholder='Phone Number' 
                    placeholderTextColor='#2e78b7'
                    underlineColorAndroid='transparent'/>

                <TextInput style = {styles.input} 
                    onChangeText={(val) => this.setState({email: val})}
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    autoCorrect={false} 
                    keyboardType='email-address' 
                    returnKeyType="next" 
                    placeholder='Email Address' 
                    placeholderTextColor='#2e78b7'
                    underlineColorAndroid='transparent'/>   
                <TextInput style = {styles.input} 
                    onChangeText={(val) => this.setState({username: val})}
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    autoCorrect={false} 
                    returnKeyType="next" 
                    placeholder='Prefered User Name' 
                    placeholderTextColor='#2e78b7'
                    underlineColorAndroid='transparent'/>

                <TextInput style = {styles.input}
                    onChangeText={(val) => this.setState({password: val})}   
                    returnKeyType="go" 
                    ref={(input)=> this.passwordInput = input} 
                    placeholder='Password' 
                    placeholderTextColor='#2e78b7' 
                    underlineColorAndroid='transparent'
                    secureTextEntry/>
                <TouchableOpacity style={styles.buttonContainer} onPress={this.onRegistrationButtonPress.bind(this)}>
                    <Text  style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
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
      color: '#2e78b7',
    },
    input:{
      height: 40,
      backgroundColor: 'rgba(225,225,225,0.2)',
      marginBottom: 10,
      padding: 10,
      color: '#2e78b7',
      borderRadius: 25,
      width:300,
      fontSize:16,
  },
  buttonContainer:{
      backgroundColor: '#2980b6',
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
  
