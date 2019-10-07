import React from 'react';
import {  View, TouchableOpacity, 
    ProgressBarAndroid, Dimensions, 
    StyleSheet,ImageBackground, Image,
    Platform} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AudioPlayer from '../components/AudioPlayer';

import { Images, materialTheme } from '../constants';
import { Audio } from 'expo-av'
import { Button, Block, Text, theme } from 'galio-framework';
import { FileSystem, Constants, Notifications,SQLite } from 'expo';
//const ICON_COLOR='#000000';

const ICON_COLOR=materialTheme.COLORS.MAIN;
const {height,width}=Dimensions.get("window");


const db = SQLite.openDatabase('gosmarticle.db');
export default class PlayerScreen extends React.Component {

    AudioPlayer = null;

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            name: '-',
            duration:0,
            point:0,
            endMin:0,
            currMin:0,
            timer:0,
            count:0,
            played:false,
            list:null,
            downloaded:false,
        };
        this.timer=0;
    }

    async componentWillMount() { 
        try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
				playsInSilentModeIOS: true,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
				shouldDuckAndroid: true,
				staysActiveInBackground: true,
				playThroughEarpieceAndroid: true
			})

		

        const { navigation } = this.props;
        const playlist=navigation.getParam('book');
        console.log('mount list from libray ' + JSON.stringify(playlist));
            //this.setState({ list: playlist.Chapters });
            let bookID = 0;
            if (global.connectionState){
               bookID = playlist.Id;
              }else{
                bookID = playlist.BookID;
              }


          
            db.transaction(async tx  => {
                await tx.executeSql('select * from Library where BookID = ' + bookID, [], (_, results) =>
                {
                  var len = results.rows.length;
                  console.log('len', len);
                  if (len > 0) {
                        tx.executeSql('select * from BookChapter where BookID = ?', [bookID], (_, { rows: { _array } }) =>
                            {
                                this.AudioPlayer = new AudioPlayer(_array);
                            }
                        );
                    }else{
                        this.AudioPlayer = new AudioPlayer(playlist.Chapters);
                    }
                   
                }
                );
                //console.log('offline data 1 : ' + this.state.data);
              }, null, function () {
              //  console.log('done?.');
              });


           

        this.timer=setInterval(this.empty,1000);
       
    } catch (e) {
        console.log(e)
    }
}

    empty = () => {

    };


    progress =() => {

        let {point,duration,currMin,timer,count}=this.state;
        if(timer!=0)
        {
            if((timer%60==0 && (timer<100) ) || ((timer-(count*100))%60==0))
            {
                count++;
                timer=count*100;
            }
        }
        timer= timer+1;
        currMin= (timer/100).toFixed(2);
        let currentduration=this.AudioPlayer.CurrentDuration();
        currentduration.then((resp) =>{
            point = Math.min((1/duration)*(resp.curr),100);
            if((resp.curr) == duration)
            {
                point=0,timer=0,currMin=0,count=0;
                clearInterval(this.timer);
               this.setState({playing:false,endMin:0,point,timer,currMin,count}); 
            }else{
               this.setState({point,timer,currMin,count}); 
            }
        } )
    };

    setclear =() => {
       clearInterval(this.timer);
       if(this.state.playing)
        {
          this.timer= setInterval(() => {
                    this.progress()
                     }, 1000);
        }else{
            clearInterval(this.timer);
        }   
    };

    PlayPause = () => {
        this.AudioPlayer.PlayPause(this.state.playing).then((r) => {
            this.setState({
                name:this.AudioPlayer.getSongName(),
                playing: !this.state.playing,
                duration:(r===undefined || r===NaN)?this.state.duration:r,
                played:true,

            })
        }).then(()=>{this.setState({endMin:(this.state.duration/60000).toFixed(2)});}).then(()=>{
            this.setclear();
        })
    
        
    };

    NextSong = () => {
        this.AudioPlayer.NextSong().then((r) => {
            this.setState({
                name: this.AudioPlayer.getSongName(),
                playing:true,
                duration:(r===undefined || r===NaN)?this.state.duration:r,
                played:true,
            });
        }).then(() => {
            this.setState({endMin:(this.state.duration/60000).toFixed(2)});
        }).then(()=>{
            this.setState({point:0,duration:0,currMin:0,timer:0,count:0});
            this.setclear();
        })
    };

    PreviousSong = () => {
        this.AudioPlayer.PreviousSong().then((r) => {
            this.setState({
                name: this.AudioPlayer.getSongName(),
                playing:(this.state.played)?true:false,
                duration:(r===undefined || r===NaN)?this.state.duration:r,
            });
        }).then(() => {
            this.setState({endMin:(this.state.duration/60000).toFixed(2)});
        }).then(()=>{
            if(this.state.played)
            {
                this.setState({point:0,duration:0,currMin:0,timer:0,count:0});
                this.setclear();
            }  
        })
    };

    fastForward = () => {  
        let {timer,count} = this.state;
        if(timer!=0)
        { 
            if(timer>(((count+1)*100)-45))
            {
                count++;
                timer=timer+45;
            }else {
                timer=timer+5;
            }
            
            this.AudioPlayer.Fastforward();
        }
        this.setState({timer,count});
    };

    fastBackward= () => {
        let {timer,count} = this.state;
        if(timer!=0)
        {
            if(timer>100 && timer<((count*100)+5))
            {
                timer=timer-45;
                count--;
            }
            else if(timer>=5)
            {
                timer=timer-5;
            }else{
                timer=0;
            }
            this.AudioPlayer.Fastbackward();
        }
        this.setState({timer,count});
    }
   
    _fetchOfflineData(bookId){
        //console.log('the book ID ' + bookId);
        db.transaction((c) => {
         c.executeSql('select * from BookChapter where BookID = ?', [bookId], (_, { rows: { _array } }) =>
         {
         this.setState(
             {
               isLoading: false, 
               list: _array,
             }
           );
         //console.log('book row : ' + JSON.stringify(_array));
            }
         );

       }, null, function () {
       });
      }        

      renderBooks = (item) => {
       //const bk = JSON.parse(item);
       //console.log('the book ' + JSON.stringify(item));
        db.transaction((tx) => {
          tx.executeSql('select * from Library where BookID = ' + item.BookID, [], (_, results) =>
          {
            var len = results.rows.length;
            console.log('len', len);
            if (len > 0) {
                //console.log('offline data downloaded : ' + this.state.downloaded);
                this.setState(
                    {
                      downloaded: true
                    }
                  );
                return (
                    this._fetchOfflineData(item.BookID)
                )
              }
              
          }
          );
          //console.log('offline data 1 : ' + this.state.data);
        }, null, function () {
        //  console.log('done?.');
        });
      
        return null;
      }


    render() {
        const { navigation } = this.props;
        const displaylist=navigation.getParam('book');
        return (
            <Block flex style={styles.options}>
            <View style={styles.marquee}>
           
            {/* {!this.state.playing && !this.state.played && (<Text style={{fontSize:24,justifyContent:'space-evenly'}}>{playlist.ChapterName}</Text>)} */}
            <Text style={{fontSize:20,justifyContent:'space-evenly'}} color={ICON_COLOR} >{displaylist.Title}</Text>
             </View>
            
             {/* <ImageBackground source={{ uri: displaylist.ImageURL}} 
                style={{width: 300, height:300, alignSelf:'center',
                resizeMode:"stretch", alignItems:'center' ,justifyContent:'center'}}
                blurRadius={90}> */}
                    <Image  source={{ uri: displaylist.ImageURL}} 
                            style={{width:200, height:200, marginBottom:15, alignSelf:'center',resizeMode:"stretch"}}
                            />
                {/* </ImageBackground> */}
             {/* {!this.state.playing && !this.state.played && (<Text style={{fontSize:10,justifyContent:'space-evenly'}}>{this.state.name}</Text>)} */}
             <Block flex center>
                <Text style={{fontSize:10,justifyContent:'space-evenly'}} color={ICON_COLOR}>{this.state.name || this.AudioPlayer.getSongName()}</Text>
           {/* <Text>{this.state.currMin}</Text> */}
             </Block>
                <View style={styles.container}>
                 <TouchableOpacity style={styles.clickbutton} onPress={this.fastBackward}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="replay-5" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity> 
                   <TouchableOpacity style={styles.clickbutton} onPress={this.PreviousSong}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="skip-previous" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity>
                 
                  <TouchableOpacity style={styles.button} onPress={this.PlayPause}>
                        <Text style={styles.buttonText}>
                        {this.state.playing && (<MaterialIcons name="pause" size={40} color={ICON_COLOR} style={styles.iconStyle} />)}
                        {!this.state.playing && (<MaterialIcons name="play-arrow" size={40} color={ICON_COLOR} style={styles.iconStyle} />)}
                          
                        </Text>
                      </TouchableOpacity>


                  <TouchableOpacity style={styles.clickbutton} onPress={this.NextSong}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="skip-next" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity>   
                  <TouchableOpacity style={styles.clickbutton} onPress={this.fastForward}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="forward-5" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity>  
                </View>
               
                <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                    {/* <Block flex row style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}> */}
                        <View style={{flex:1,alignItems:'flex-start'}}>
                        {this.state.timer === 0 &&(<Text color={ICON_COLOR}>0.00</Text>)}
                        {this.state.timer !== 0 &&(<Text color={ICON_COLOR}>{this.state.currMin}</Text>)}
                        </View>
                        
                        <View style={{flex:1,alignItems:'flex-end'}}>
                        {(this.state.endMin===0)&&(<Text color={ICON_COLOR}>0.00</Text>)}
                        {(this.state.endMin!==0)&&(<Text color={ICON_COLOR}>{this.state.endMin}</Text>)}
                        </View>
               
                </View>
                <ProgressBarAndroid
                      styleAttr="Horizontal"
                      indeterminate={false}
                      width={width-60}
                      progress={this.state.point}
                      color={ICON_COLOR}
                    />
                {/* </Block> */}
            </Block>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:'row',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    marquee:{
      marginTop:30,
      flex:1,
      flexDirection:'row',
      justifyContent: 'center',
      marginBottom:10,
    },
    buttonText: {
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    iconStyle:{
      position:'absolute',
    },
     button: {
      width: 50,
      height: 100/1.618,
      margin: 5,
      borderRadius: 50,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    lefbutton: {
      width: 50,
      height: 100/1.618,
      margin: 5,
      borderRadius: 50,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    clickbutton:{
      width: 50,
      height: 100/1.618,
      margin: 5,
      borderRadius: 50,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    options: {
        position: 'relative',
        padding: theme.SIZES.BASE,
        marginHorizontal: theme.SIZES.BASE,
        marginTop: Platform.OS === 'android' ? theme.SIZES.BASE / 2 : theme.SIZES.BASE * 7,
        marginBottom: Platform.OS === 'android' ? theme.SIZES.BASE  : theme.SIZES.BASE * 7,
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
  });
  
