import React from "react";
import { View,StyleSheet,ScrollView,Dimensions,
    TouchableOpacity,ImageBackground, Platform,
     Icon, Image, Slider,Alert,AsyncStorage} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
  import { Audio } from "expo";
  import { Ionicons } from '@expo/vector-icons';

  import { Images, materialTheme } from '../constants';
  import { HeaderHeight } from "../constants/utils";
  import {Recorder, Player} from 'react-native-audio-player-recorder-no-linking';

  import { API } from '../constants/globalURL';

  const { width, height } = Dimensions.get('screen');
  const thumbMeasure = (width - 48 - 32) / 3;

const ACCESS_TOKEN = 'access_token';
  export default class BooKListDetails extends React.Component {
   
      constructor(props) {
        super(props);
        this.soundObject = new Audio.Sound();
        this.state = { isPlaying: false, isLoading: false };
        // this.loadAudio = this.loadAudio.bind(this);
        // this.toggleAudioPlayback = this.toggleAudioPlayback.bind(this);
      }


    componentWillUnmount(){
     //this.soundObject.stopAsync();
     //this.Player.stopAsync();

  }

   

  
    async _freebookAdd(book) {
      this.state = { isLoading: true };
      //let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
      // global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
      // global.userDetails = await AsyncStorage.getItem("UserDetails");
      //console.log( global.userDetails);
      const userDetails = JSON.parse(global.userDetails);
     // console.error('book :    '+book.ImageURL);
     let payload = JSON.stringify({
      BookID: book.Id,
      Reference: Math.floor(Math.random() * 10000000000) + 1 ,
      UserName: userDetails.Email,
      Amount: 0,
      PaymentMode: "Free",
      Status: "success"
  });
  console.log('payload :    '+payload);
try{
      let response = await fetch(API.URL+'/api/Payment/PaymentUpdate',{
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + global.token,
                  },
                  body: payload,
                });
                console.log('Status :    '+response.status);
                if (response.status >= 200 && response.status < 300) {
                  this.setState(
                    {
                      isLoading: false
                    },
                    
                  );
                  Alert.alert('Book Added to your library');
                }else{
                  Alert.alert('Can not download book at this time.');
                }
        // .then(response => response.json())
        // .then(responseJson => {
        //   this.setState(
        //     {
        //       isLoading: false
        //     },
            
        //   );
         
        // })
        // .catch(error => {
        //   console.error(error);
          
        // });
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
        this.setState({isLoading: false, error: errorArray});

        Alert.alert('Can not login at this time!');

    }
    }

    render() {
        const { navigation } = this.props;
        const bookDetails=navigation.getParam('book');
        //console.log('Details view props: ', bookDetails);
        //console.log('Details view : ', bookDetails.BookDetails);
        if(this.state.isLoading){
          return( 
            <View style={styles.loader}> 
              <ActivityIndicator size="large" color="#0c9"/>
            </View>
        )}

        return (
       
        <Block flex style={styles.options}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text bold size={16} style={styles.title}>{bookDetails.Title}</Text>
                <Block flex card shadow style={styles.category}>
                  <ImageBackground
                    source={{ uri: bookDetails.ImageURL }}
                    style={[styles.imageBlock, { width: width - (theme.SIZES.BASE * 2), height: 252 }]}
                    imageStyle={{ width: width - (theme.SIZES.BASE * 2), height: 252 }}
                    resizeMode="stretch">
                    
                  </ImageBackground>
                  <Block style={styles.categoryTitle}>
                      <Text size={18} bold color={theme.COLORS.MAIN}>Details</Text>
                      <Text>Title: {bookDetails.Title}</Text>
                      <Text>Gerne: {bookDetails.Gernes}</Text>
                      <Text>Author: {bookDetails.Author}</Text>
                      <Text>Narrator: {bookDetails.Narrator}</Text>
                      <Text>Category: {bookDetails.Category}</Text>
                      <Text>Summary: {bookDetails.Summary}</Text>
                      <Text color="green">Price : {bookDetails.Price >0 ? "N"+bookDetails.Price : "Free"}</Text>
                    </Block>
               
                    <Block flex  center space="between">
                    <Text>Play Review</Text>
                    <Player
                            style={{ flex: 1 }}
                            //onComplete={this.playerComplete.bind(this)}
                            //completeButtonText={'Return Home'}
                            uri={bookDetails.ShortAudioURL}
                            showDebug={false}
                            showBackButton={false}
                            playbackSlider={(renderProps) => {
                                return ( 
                                <Slider
                                    minimimValue={0}
                                    maximumValue={renderProps.maximumValue}
                                    onValueChange={renderProps.onSliderValueChange}
                                    value={renderProps.value}
                                    style={{
                                    width: '100%'
                                    }}
                                />
                                );
                            }}
                        /> 
                  
            
            </Block>
           <Block flex center space="between">
                {bookDetails.Price >0 ? 
                  <Button
                      shadowless
                      style={styles.button}
                      onPress={()=> this.props.navigation.navigate('Payment',{paymentDetails:bookDetails})} 
                      color='green'>
                      BUY NOW
                    </Button>
                  : <Button
                  shadowless
                  style={styles.button}
                  onPress={()=> this._freebookAdd(bookDetails)} 
                    color='green'>
                  DOWNLOAD
                  
                </Button>}
             </Block>
           </Block>



          <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
            <Block middle>
              <Text bold size={12} style={{marginBottom: 8}}>{bookDetails.DownloadCount} </Text>
              <Text muted size={12}><Ionicons name="md-download" size={20} color="#2e78b7" /> </Text>
            </Block>
            {/* <Block middle>
              <Text bold size={12} style={{marginBottom: 8}}>5</Text>
              <Text muted size={12}>Bids & Offers</Text>
            </Block> */}
            <Block middle>
              <Text bold size={12} style={{marginBottom: 8}}>{bookDetails.LikeCount}</Text>
              <Text muted size={12}><Ionicons name="md-heart" size={20} color="#2e78b7" /></Text>
            </Block>
          </Block>

          {/* <Block row space="between" style={{ paddingVertical: 16, alignItems: 'baseline' }}>
            <Text size={16}>Recently viewed</Text>
            <Text size={12} color={theme.COLORS.PRIMARY} onPress={() => this.props.navigation.navigate('Home')}>View All</Text>
          </Block> */}
         
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
      backgroundColor: materialTheme.COLORS.LABEL,
      paddingHorizontal: 6,
      marginRight: theme.SIZES.BASE / 2,
      borderRadius: 4,
      height: 19,
      width: 38,
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
  