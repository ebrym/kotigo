import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity, 
  AsyncStorage,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';

  import { Block, Button, Text, theme,Input } from 'galio-framework';
import Loader from '../components/Loader';
import  API  from '../constants/globalURL';
import materialTheme from '../constants/Theme';

const { height, width } = Dimensions.get('screen');
const ACCESS_TOKEN = 'access_token';
const Errors = (props) => {
    return (
        <View>
            {props.errors.map((error, i) => <Text key={i} style={styles.error}>{error}</Text>)}
        </View>
    )
}

export default class LoginScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);

    this.state ={
        username: "",
        password: "",
        loading: false,//loading: false,
        error: ""
    }
  }
   
  componentDidMount(){
     // console.log(API.URL);
    this._loadInitialState().done();
    //this.setState({loading: false});
}
    _loadInitialState = async () => {
        let token = await AsyncStorage.getItem(ACCESS_TOKEN);
        global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
        global.userDetails = await AsyncStorage.getItem("UserDetails");
        //let expires = await AsyncStorage.getItem(TOKEN_VALIDITY);  
        if (token !== null) {
           this.setState({loading: false});
           console.log("token : " + token)
            this.props.navigation.navigate('App'); 
        }
    }

    async storeToken(accessToken) {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
            this.getToken();
        } catch(error) {
            console.log("Something went wrong")
        }
    }

    async getToken() {
        try {
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);            
            console.log("token is:" + token);
        } catch(error) {
            
            console.log("Something went wrong")
        }
    }

    async onLoginButtonPress() {
        this.setState({
            loading: true
          });
        try {

           
            let response = await fetch(API.URL + '/User/authenticate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });
            let res = await response.json();
            if (response.status >= 200 && response.status < 300) {
                this.setState({loading: false, error: ""});
                let accessToken = res.access_token;

                //store user details
                AsyncStorage.setItem('UserDetails', JSON.stringify(res));
                global.userDetails = JSON.stringify(res);
                let tokenValidity = res.access_token;
                this.storeToken(accessToken);          
                await AsyncStorage.setItem('Token_Validity',tokenValidity);                  
                //console.log("Response success is: " + accessToken); 
                //console.log("tokenValidity is: " + tokenValidity); 

                this.props.navigation.navigate('Home');
            } else {
                //let error = res;
                Alert.alert('Invalid credentials!!');
                this.setState({loading: false});
                console.log("Response success is: " ); 
                //throw error;
            }

        this.setState({loading: false});
        } catch(error){
            Alert.alert('Can not login at this time!');
            this.setState({loading: false});
        }
    }

    _handleHelpPress() {
        this.props.navigation.navigate('Register');
      };

  render() {
      
    return (
      <View style={styles.container}>
      {/* <Logo/> */}
      <Loader
          loading={this.state.loading} />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
          <Block flex center>
            <Image
              source={require('../assets/images/kotigo.png')
              }
              style={styles.welcomeImage}
            />
           
            <Text style={styles.helpLinkText}>Login</Text>
          </Block>
          <Block flex center>
          <Input style = {styles.input} 
                            onChangeText={(val) => this.setState({username: val})} 
                            keyboardType='email-address' 
                            placeholder='Email or UserName' 
                            color={materialTheme.COLORS.MAIN}
                            placeholderTextColor={materialTheme.COLORS.MAIN}
                            underlineColorAndroid='transparent'/>
            
             <Input style = {styles.input} 
                            onChangeText={(val) => this.setState({password: val})}  
                            placeholder='Password' 
                            color={materialTheme.COLORS.MAIN}
                        placeholderTextColor={materialTheme.COLORS.MAIN}
                            underlineColorAndroid='transparent'
                            secureTextEntry/>


                <TouchableOpacity style={styles.buttonContainer} 
                                    onPress={this.onLoginButtonPress.bind(this)}>
                            <Text  style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity> 
           
          </Block>

          <View style={styles.helpContainer}>
            <Text style={styles.helpLinkText}>Don't have an account yet!</Text>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Register')} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Sign Up</Text>
            </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.props.navigation.navigate('ResetAccount')} style={styles.resetLink}>
              <Text style={styles.buttonText}>Reset Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: theme.SIZES.BASE,
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

  helpLinkText:{
    fontSize: 14,
    color: '#2e78b7',
  },
 
  resetLink: {
    fontSize: 14,
    color: '#2e78b7',
    backgroundColor: materialTheme.COLORS.ERROR,
    borderRadius: 25, paddingVertical: 10,
    width: 150
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
