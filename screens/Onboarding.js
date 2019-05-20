import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions, 
  Platform, TouchableOpacity,AsyncStorage } from 'react-native';
import { Block, Button, Text, theme,Input } from 'galio-framework';

const { height, width } = Dimensions.get('screen');
import { Select, Icon, Header, Product, Switch } from '../components/';

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';

import Loader from '../components/Loader';

const ACCESS_TOKEN = 'access_token';
export default class Onboarding extends React.Component {
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
        //let expires = await AsyncStorage.getItem(TOKEN_VALIDITY);  
        if (token !== null) {
           this.setState({loading: false});
           console.log("token : " + token)
            this.props.navigation.navigate('Main'); 
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

            this.props.navigation.navigate('Main');
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
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex center>
          {/* <ImageBackground
            source={{  uri: Images.Onboarding }}
            style={{ height: height, width: width, marginTop: '-55%', zIndex: 1 }}
          /> */}
          
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 2 }}>
          
            <Block center>
          
            <Text  style={styles.buttonText}>LOGIN</Text>
            <Input
            right
            placeholder="icon right"
            onChangeText={(val) => this.setState({username: val})} 
            placeholderTextColor={materialTheme.COLORS.DEFAULT}
            placeholderTextColor='#2e78b7' 
            keyboardType='email-address' 
            placeholder='Email or UserName' 
            style={{ borderRadius: 3, borderColor: materialTheme.COLORS.INPUT }}
          />
             <Input
            right
            placeholder="icon right"
                            onChangeText={(val) => this.setState({password: val})}  
                            placeholder='Password' 
                            placeholderTextColor='#2e78b7' 
                            underlineColorAndroid='transparent'
                            secureTextEntry
                            style={{ borderRadius: 3, borderColor: materialTheme.COLORS.INPUT }}
                          />

                <TouchableOpacity style={styles.buttonContainer} 
                                    onPress={this.onLoginButtonPress.bind(this)}>
                </TouchableOpacity> 
              <Button
                shadowless
                style={styles.button}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={() => navigation.navigate('Home')}>
                GET STARTED
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
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
  },
});
