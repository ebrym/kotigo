import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity, 
  AsyncStorage,
  ActivityIndicator,
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

export default class ResetAccountScreen extends React.Component {

 
  constructor(props){
    super(props);

    this.state ={
        email: "",
        password: "",
        loading: false,//loading: false,
        error: ""
    }
  }
   
  componentDidMount(){
}






    async onLoginButtonPress() {
        this.setState({
            loading: true
          });
        try {

           
            let response = await fetch(API.URL + '/User/resetaccount', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({
                    email: this.state.email
                })
            });
            //let res = await response.json();
            if (response.status >= 200 && response.status < 300) {
                this.setState({loading: false});
                Alert.alert('kindly check your email for account reset link.');
            } else {
                let error = res;

                this.setState({loading: false});
                Alert.alert('Invalid email!!');
                throw error;
            }

        this.setState({loading: false});
        } catch(error){
            
            this.setState({loading: false});

            Alert.alert('Can not reset account at this time!');

        }
    }

    _handleHelpPress() {
        this.props.navigation.navigate('Register');
      };

  render() {
    if(this.state.loading){
        return( 
          <View style={styles.loader}> 
            <ActivityIndicator size="large" color="#0c9"/>
          </View>
      )}
      
    return (
      <View style={styles.container}>
      {/* <Logo/> */}
      {/* <Loader
          loading={this.state.loading} /> */}
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
          <Block flex center>
            <Image
              source={require('../assets/images/gosmarticlelogo.png')
              }
              style={styles.welcomeImage}
            />
           
            <Text style={styles.helpLinkText}>Reset Account</Text>
          </Block>
          <Block flex center>
          <Input style = {styles.input} 
                            onChangeText={(val) => this.setState({email: val})} 
                            keyboardType='email-address' 
                            placeholder='Email' 
                            color={materialTheme.COLORS.MAIN}
                            placeholderTextColor={materialTheme.COLORS.MAIN}
                            underlineColorAndroid='transparent'/>

                <TouchableOpacity style={styles.buttonContainer} 
                                    onPress={this.onLoginButtonPress.bind(this)}>
                            <Text  style={styles.buttonText}>RESET</Text>
                </TouchableOpacity> 
           
          </Block>

          <View style={styles.helpContainer}>
            <Text style={styles.helpLinkText}>Don't have an account yet!</Text>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Register')} style={styles.helpLink}>
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
