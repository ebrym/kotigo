import React from 'react';
import { Alert } from "react-native";
import { Audio } from "expo";



export default class AudioPlayer {

    index = 0;
    

    constructor(list, initialState = {speed: 1, autoPlay: true }) {
  
        this.soundObject = new Audio.Sound();
        // Set speed value
        this.speed = initialState.speed;
        this.list = list;
    }


    getSongName = () => {
        //console.log("The list is index : ",this.list);
        //console.log("The list is index : ",this.list[index].ChapterName);
         return this.list[this.index].ChapterName;
        //return this.list.Title;
    };

    setSpeed = (speed) => {
        this.soundObject.setRateAsync(speed);
    };
    Fastforward = async () => {
          const Mill = await this.soundObject.getStatusAsync();
          let p = Mill.positionMillis;
          await this.soundObject.setPositionAsync(p+5000);
    };


    Fastbackward = async () => {
          const Mill = await this.soundObject.getStatusAsync();
          let p = Mill.positionMillis;
          await this.soundObject.setPositionAsync(p-5000);
    };
   

  CurrentDuration = async () => {
        const Mill = await this.soundObject.getStatusAsync();
        let p = Mill.positionMillis;
        return {curr:p};
  };
 

    PlayPause = async (playing) => {
        //const index=this.index;
        
        console.log("The list is",this.list);

        //console.log("The list is",this.list[index].AudioURL);
        //console.log("index : " + index);
        //const path = this.list[this.index].AudioURL;
        //console.log("path : " + path);
        //this.index = index;
       // const path = this.list.AudioURL;
       const index=this.index;
       const path = this.list[index].AudioURL;
        if(playing) {
            //console.log("path : " + path);
            //await this.soundObject.setStatusAsync({ shouldPlay: true });
            await this.soundObject.pauseAsync();
            //await this.soundObject.stopAsync();
            const milliseconds= await this.soundObject.getStatusAsync();
            console.log(milliseconds.durationMillis);
            return milliseconds.durationMillis;

        } else {

            if(this.soundObject._loaded) {
                await this.soundObject.playAsync();
            } else {
                    await this.soundObject.loadAsync({uri: path});
             
                
                await this.soundObject.playAsync();
                const milliseconds= await this.soundObject.getStatusAsync();
                console.log(milliseconds.durationMillis)
                return milliseconds.durationMillis;
            }
        }
        
    };


    NextSong = async () => {
        console.log("index : " + this.index);
        if(!this.list[this.index + 1]) {
            Alert.alert('No More Songs...');
        } else {
          
            const path = this.list[this.index + 1].AudioURL;
            this.index++;
            //await this.soundObject.stopAsync();
            await this.soundObject.unloadAsync();
            await this.soundObject.loadAsync({uri: path});
   
            await this.soundObject.playAsync();
             const milliseconds= await this.soundObject.getStatusAsync();
            console.log("The duration is",milliseconds.durationMillis)
            return milliseconds.durationMillis;
          
        }
    };


    PreviousSong = async () => {
        if(!this.list[this.index  - 1]) {
            Alert.alert('No Previous Song Available...');
        } else {
            const path = this.list[this.index  - 1].AudioURL;
            this.index--;
            await this.soundObject.unloadAsync();
            await this.soundObject.loadAsync({uri: path});
       
            await this.soundObject.playAsync();
            const milliseconds= await this.soundObject.getStatusAsync();
            console.log("The duration is",milliseconds.durationMillis)
            return milliseconds.durationMillis;

        }
    };
}     

// if (global.connectionState){
            //     await this.soundObject.loadAsync({uri: path});
            //   }else{
            //     await this.soundObject.loadAsync(path);
            //   }