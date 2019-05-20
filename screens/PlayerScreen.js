import React from 'react'
import { View, Image, Text, Slider, TouchableOpacity, Platform, Alert,ImageBackground} from 'react-native';
import { Audio } from "expo";
import { Ionicons } from '@expo/vector-icons';
// import Sound from 'react-native-sound';

const img_speaker = require('../assets/resources/ui_speaker.png');
const img_pause = require('../assets/resources/ui_pause.png');
const img_play = require('../assets/resources/ui_play.png');
const img_playjumpleft = require('../assets/resources/ui_playjumpleft.png');
const img_playjumpright = require('../assets/resources/ui_playjumpright.png');

export default class PlayerScreen extends React.Component{
    static navigationOptions = {
        title: 'Player',
      };
    // static navigationOptions = props => ({
    //     title:props.navigation.state.params.title,
    // })

    constructor(){
        super();
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0
        }
        this.sliderEditing = false;
        this.soundObject = new Audio.Sound();
    }

    // componentDidMount(){
    //     this.play();
        
    //     this.timeout = setInterval(() => {
    //         if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing){
    //             this.sound.getCurrentTime((seconds, isPlaying) => {
    //                 this.setState({playSeconds:seconds});
    //             })
    //         }
    //     }, 100);
    // }
    componentWillUnmount(){
        if(this.soundObject){
            this.soundObject.release();
            this.soundObject = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if(this.soundObject){
            this.soundObject.setCurrentTime(value);
            this.setState({playSeconds:value});
        }
    }

    play = async () => {
        //const index=this.index;
        //const path = this.list[index].path;

        if(playing) {
            await this.soundObject.pauseAsync();
            const milliseconds= await this.soundObject.getStatusAsync();
            console.log(milliseconds.durationMillis);
            return milliseconds.durationMillis;

        } else {

            if(this.soundObject._loaded) {
                await this.soundObject.playAsync();
            } else {
                await this.soundObject.loadAsync(path);
                await this.soundObject.playAsync();
                const milliseconds= await this.soundObject.getStatusAsync();
                console.log(milliseconds.durationMillis)
                return milliseconds.durationMillis;
            }
        }
        // if(this.sound){
        //     this.sound.play(this.playComplete);
        //     this.setState({playState:'playing'});
        // }else{
        //     const filepath = this.props.navigation.state.params.filepath;
        //     console.log('[Play]', filepath);
    
        //     this.sound = new Sound(filepath, '', (error) => {
        //         if (error) {
        //             console.log('failed to load the sound', error);
        //             Alert.alert('Notice', 'audio file error. (Error code : 1)');
        //             this.setState({playState:'paused'});
        //         }else{
        //             this.setState({playState:'playing', duration:this.sound.getDuration()});
        //             this.sound.play(this.playComplete);
        //         }
        //     });    
        // }
    }
    // playComplete = (success) => {
    //     if(this.sound){
    //         if (success) {
    //             console.log('successfully finished playing');
    //         } else {
    //             console.log('playback failed due to audio decoding errors');
    //             Alert.alert('Notice', 'audio file error. (Error code : 2)');
    //         }
    //         this.setState({playState:'paused', playSeconds:0});
    //         this.sound.setCurrentTime(0);
    //     }
    // }

    pause = async  () => {
        if(this.soundObject){
            await this.soundObject.pauseAsync();
        }

        this.setState({playState:'paused'});
    }

    jumpPrev15Seconds = () => {this.jumpSeconds(-15);}
    jumpNext15Seconds = () => {this.jumpSeconds(15);}
    jumpSeconds = (secsDelta) => {
        if(this.sound){
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if(nextSecs < 0) nextSecs = 0;
                else if(nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.soundObject.setCurrentTime(nextSecs);
                this.setState({playSeconds:nextSecs});
            })
        }
    }

    getAudioTimeString(seconds){
        const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    render(){
        const { navigation } = this.props;
        const bookDetails=navigation.getParam('book');
        // const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        // const durationString = this.getAudioTimeString(this.state.duration);

        return (
            <View style={{flex:1, justifyContent:'center', backgroundColor:'white'}}>
                <ImageBackground source={{ uri: bookDetails.ImageURL}} 
                style={{width: 300, height:300, alignSelf:'center',
                resizeMode:"stretch", alignItems:'center' ,justifyContent:'center'}}
                blurRadius={90}>
                    <Image  source={{ uri: bookDetails.ImageURL}} 
                            style={{width:200, height:200, marginBottom:15, alignSelf:'center',resizeMode:"stretch"}}
                            />
                </ImageBackground>
                
                <View style={{flexDirection:'row', justifyContent:'center', marginVertical:15}}>
                    <TouchableOpacity style={{justifyContent:'center'}}>
                        <Image style={{width:40, height:40}}/>
                        <Text style={{position:'absolute', alignSelf:'center', marginTop:1, color:'black', fontSize:12}}>15</Text>
                    </TouchableOpacity>
                    {this.state.playState == 'playing' && 
                    <TouchableOpacity  style={{marginHorizontal:20}}>
                        {/* <Image source={img_pause} style={{width:30, height:30}}/> */}
                        <Ionicons name="md-pause" size={30}color="#2e78b7" />
                    </TouchableOpacity>}
                    {this.state.playState == 'paused' && 
                    <TouchableOpacity style={{marginHorizontal:20}}>
                        {/* <Image source={img_play} style={{width:30, height:30}}/>    */}
                         <Ionicons name="md-play" size={30} color="#2e78b7" />
                    
                    </TouchableOpacity>}
                    <TouchableOpacity style={{justifyContent:'center'}}>
                        <Image source={img_playjumpright} style={{width:30, height:30}}/>
                        <Text style={{position:'absolute', alignSelf:'center', marginTop:1, color:'black', fontSize:12}}>15</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginVertical:15, marginHorizontal:15, flexDirection:'row'}}>
                    {/* <Text style={{color:'white', alignSelf:'center'}}>{currentTimeString}</Text> */}
                    <Slider
                        //onTouchStart={this.onSliderEditStart}
                        // onTouchMove={() => console.log('onTouchMove')}
                        //onTouchEnd={this.onSliderEditEnd}
                        // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                        // onTouchCancel={() => console.log('onTouchCancel')}
                        //onValueChange={this.onSliderEditing}
                        //value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='gray' minimumTrackTintColor='white' thumbTintColor='white' 
                        style={{flex:1, alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                    {/* <Text style={{color:'white', alignSelf:'center'}}>{durationString}</Text> */}
                </View>
            </View>
        )
    }
}
