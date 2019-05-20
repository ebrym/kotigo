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
           
            let response = await fetch('http://216.10.247.42:8089/api/User/authenticate', {
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

                let tokenValidity = res.access_token;
                this.storeToken(accessToken);          
                await AsyncStorage.setItem('Token_Validity',tokenValidity);                  
                //console.log("Response success is: " + accessToken); 
                console.log("tokenValidity is: " + tokenValidity); 

                this.props.navigation.navigate('App');
            } else {
                let error = res;

                this.setState({loading: false});
                Alert.alert('Invalid credentials!!');
                throw error;
            }

        this.setState({loading: false});
        } catch(error){
            console.log("catch error: " + error);
           
            let formError = JSON.parse(error);
            let errorArray = [];
            for(let key in formError) {
                if(formError[key].length > 1){
                    formError[key].map(error => errorArray.push(`${key} ${error}`))
                } else {
                    errorArray.push(`${key} ${formError[key]}`)
                }
            }
            this.setState({loading: false, error: errorArray});

            Alert.alert('Can not login at this time!');

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
        
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/gosmarticlelogo.png')
              }
              style={styles.welcomeImage}
            />
           
            <Text style={styles.helpLinkText}>Login</Text>
          </View>
          <View style={styles.getStartedContainer}>
          <Input style = {styles.input} 
                            onChangeText={(val) => this.setState({username: val})} 
                            keyboardType='email-address' 
                            placeholder='Email or UserName' 
                            placeholderTextColor='#2e78b7'
                            underlineColorAndroid='transparent'/>
            
             <Input style = {styles.input} 
                            onChangeText={(val) => this.setState({password: val})}  
                            placeholder='Password' 
                            placeholderTextColor='#2e78b7' 
                            underlineColorAndroid='transparent'
                            secureTextEntry/>

                <TouchableOpacity style={styles.button} 
                                    onPress={this.onLoginButtonPress.bind(this)}>
                            <Text  style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity> 
           
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpLinkText}>Don't have an account yet!</Text>
            <TouchableOpacity onPress={this._handleHelpPress.bind(this)} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Sign Up</Text>
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
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 25,
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
