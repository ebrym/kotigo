import React from "react";
import { View,StyleSheet,ScrollView,Dimensions,
    TouchableOpacity,ImageBackground, Platform,
     Icon, Image} from 'react-native';
  //import { ListItem,Card } from 'react-native-elements'
import { Button, Block, Text, Input, theme } from 'galio-framework';
  import { Audio } from "expo";
  import { Ionicons } from '@expo/vector-icons';

  import { Images, materialTheme } from '../constants';
  import { HeaderHeight } from "../constants/utils";
  
  const { width, height } = Dimensions.get('screen');

  export default class BooKListDetails extends React.Component {
   
      constructor(props) {
        super(props);
        this.soundObject = new Audio.Sound();
        this.state = { isPlaying: false };
        // this.loadAudio = this.loadAudio.bind(this);
        // this.toggleAudioPlayback = this.toggleAudioPlayback.bind(this);
      }
    //   async loadAudio(bookDetails){
    //     const soundObject = new Audio.Sound();
    //         try {
    //         await soundObject.loadAsync(require({uri: bookDetails.ShortAudioURL}));
    //         await soundObject.playAsync();
    //         // Your sound is playing!
    //         } catch (error) {
    //         // An error occurred!
    //         }
    //     // Player.play(bookDetails.ShortAudioURL, {
    //     //   title: bookDetails.Title,
    //     //   artist: bookDetails.Narrator,
    //     //   album_art_uri: bookDetails.ImageURL,
    //     // });
    //   }
    //   componentWillUnmount() {
    //     this.soundObject.stopAsync();
    //   }
    //   toggleAudioPlayback() {
    //     this.setState({
    //       isPlaying: !this.state.isPlaying,
    //     }, () => (this.state.isPlaying
    //       ? this.soundObject.playAsync()
    //       : this.soundObject.stopAsync()));
    //   }
    //   onPause() {
    //     Player.pause();
    //   }

    componentWillUnmount(){
     this.soundObject.stopAsync();

  }

    play = async (audioPath) => {
      if(this.state.isPlaying) {
          await this.soundObject.pauseAsync();
          const milliseconds= await this.soundObject.getStatusAsync();
          console.log(milliseconds.durationMillis);
          console.log(this.state.isPlaying);
          return milliseconds.durationMillis;
      } else {
          if(this.soundObject._loaded) {
              await this.soundObject.playAsync();
              this.setState({isPlaying:true});
              console.log(this.state.isPlaying);
          } else {
              await this.soundObject.loadAsync({uri: audioPath});
              await this.soundObject.playAsync();
              const milliseconds= await this.soundObject.getStatusAsync();
              this.setState({isPlaying:true});
              console.log(milliseconds.durationMillis)
              
          console.log(this.state.isPlaying);
              return milliseconds.durationMillis;
          }
          
      }
    }

    pause = async  () => {
      if(this.soundObject){
          await this.soundObject.pauseAsync();
      }
      this.setState({isPlaying:false});
    }
    render() {
        const { navigation } = this.props;
        const bookDetails=navigation.getParam('book');
        console.log('Details view props: ', bookDetails);
        //console.log('Details view : ', bookDetails.BookDetails);
     

        return (
        <ScrollView>
            <Block flex style={styles.group}>
            <Block flex>

              <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                
            <Text bold size={16} style={styles.title}>{bookDetails.Title}</Text>
                <Block flex card shadow style={styles.category}>
                  <ImageBackground
                    source={{ uri: bookDetails.ImageURL }}
                    style={[styles.imageBlock, { width: width - (theme.SIZES.BASE * 2), height: 252 }]}
                    imageStyle={{ width: width - (theme.SIZES.BASE * 2), height: 252 }}
                    resizeMode="stretch">
                    
                  </ImageBackground>
                  <Block style={styles.categoryTitle}>
                      <Text size={18} bold color={theme.COLORS.WHITE}>Book Details</Text>
                      <Text>Title: {bookDetails.Title}</Text>
                      <Text>Gerne: {bookDetails.Gernes}</Text>
                      <Text>Author: {bookDetails.Author}</Text>
                      <Text>Narrator: {bookDetails.Narrator}</Text>
                      <Text>Category: {bookDetails.Category}</Text>
                      <Text>Summary: {bookDetails.Summary}</Text>
                      <Text color="green">Price : N{bookDetails.Price}</Text>
                    </Block>
                    <Block flex  row space="between">
                  {this.props.isPlaying ? (
                    <TouchableOpacity style={{marginHorizontal:20}} onPress={() => this.pause()}>
                       <Ionicons name="md-pause-circle" size={30} color="#2e78b7" /> 
                    </TouchableOpacity>) :
                    <TouchableOpacity style={{marginHorizontal:20}} onPress={() => this.play(bookDetails.ShortAudioURL)}>
                        {/* <Image source={img_play} style={{width:30, height:30}}/>    */}
                         <Ionicons name="md-play-circle" size={30} color="#2e78b7" />
                    </TouchableOpacity>}
                    <Text > Play Review</Text>

                  <Text ><Ionicons name="md-download" size={20} color="#2e78b7" />   
                  {bookDetails.DownloadCount} 
                  <Ionicons name="md-heart" size={30} color="#2e78b7" />
                  {bookDetails.LikeCount} 
                  </Text>
            </Block>
            {/* <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-around' }}> */}
             <Block flex row space="between">
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
             onPress={()=> this.props.navigation.navigate('Payment',{paymentDetails:bookDetails})} 
              color='green'>
             DOWNLOAD
           </Button>}
             </Block>
          
                </Block>
              </Block>
            </Block>
          </Block>
        </ScrollView>
 
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
  });
  