import React from 'react';
import {  View, TouchableOpacity, 
    ProgressBarAndroid, Dimensions, StyleSheet,ImageBackground, Image} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AudioPlayer from '../components/AudioPlayer';
// import MarqueeText from 'react-native-marquee';

import { Button, Block, Text, theme } from 'galio-framework';

const ICON_COLOR='#000000';
const {height,width}=Dimensions.get("window");


export default class PlayerScreen extends React.Component {

    AudioPlayer = null;

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            name: 'GoSmarticle Audio Book Player',
            duration:0,
            point:0,
            endMin:0,
            currMin:0,
            timer:0,
            count:0,
            played:false,
        };
        this.timer=0;
    }

    componentWillMount() {
       
        
        this.timer=setInterval(this.empty,1000);
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
    
            
    render() {
        const { navigation } = this.props;
        const playlist=navigation.getParam('book');
        this.AudioPlayer = new AudioPlayer(playlist);
       // console.log('Playlist : ' + JSON.stringify(playlist));
        return (
            <Block flex style={styles.options}>
            <View style={{flex:1,flexDirection:'column'}}>
            <View style={styles.marquee}>
            {/* {this.state.played && (
                

                        // <MarqueeText
                        //   style={{ fontSize: 24 }}
                        //   duration={3000}
                        //   marqueeOnStart
                        //   loop
                        //   marqueeDelay={1000}
                        //   marqueeResetDelay={1000}
                        // >
                        //   {this.state.name} 
                        // </MarqueeText>
                 )
            } */}
            {!this.state.playing && !this.state.played && (<Text style={{fontSize:24,justifyContent:'space-evenly'}}>{playlist.Title}</Text>)}
             </View>
            
             <ImageBackground source={{ uri: playlist.ImageURL}} 
                style={{width: 300, height:300, alignSelf:'center',
                resizeMode:"stretch", alignItems:'center' ,justifyContent:'center'}}
                blurRadius={90}>
                    <Image  source={{ uri: playlist.ImageURL}} 
                            style={{width:200, height:200, marginBottom:15, alignSelf:'center',resizeMode:"stretch"}}
                            />
                </ImageBackground>
                <View style={styles.container}>
                 <TouchableOpacity style={styles.clickbutton} onPress={this.fastBackward}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="replay-5" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity> 
                  {/* <TouchableOpacity style={styles.clickbutton} onPress={this.PreviousSong}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="skip-previous" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity> */}

                  <TouchableOpacity style={styles.button} onPress={this.PlayPause}>
                        <Text style={styles.buttonText}>
                        {this.state.playing && (<MaterialIcons name="pause" size={40} color={ICON_COLOR} style={styles.iconStyle} />)}
                        {!this.state.playing && (<MaterialIcons name="play-arrow" size={40} color={ICON_COLOR} style={styles.iconStyle} />)}
                          
                        </Text>
                      </TouchableOpacity>


                  {/* <TouchableOpacity style={styles.clickbutton} onPress={this.NextSong}>
                    <Text style={styles.buttonText}>
                      <MaterialIcons name="skip-next" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity>    */}
                  <TouchableOpacity style={styles.clickbutton} onPress={this.fastForward}>
                    <Text style={styles.buttonText}>
                    
                      <MaterialIcons name="forward-5" size={40} color={ICON_COLOR} style={styles.iconStyle} />
                    </Text>
                  </TouchableOpacity>  
                </View>
                <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                <View style={{flex:1,alignItems:'flex-start'}}>
                {(this.state.timer === 0)&&(<Text>0.00</Text>)}
                {(this.state.timer !== 0)&&(<Text>{this.state.currMin}</Text>)}
                </View>
                <ProgressBarAndroid
                      styleAttr="Horizontal"
                      indeterminate={false}
                      width={width-60}
                      progress={this.state.point}
                    />
                <View style={{flex:1,alignItems:'flex-end'}}>
                {(this.state.endMin===0)&&(<Text>0.00</Text>)}
                {(this.state.endMin!==0)&&(<Text>{this.state.endMin}</Text>)}
                </View>
                </View>
            </View>
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
      marginTop:100,
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
        marginTop: theme.SIZES.BASE * 7,
        marginBottom: theme.SIZES.BASE*7, 
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
  
