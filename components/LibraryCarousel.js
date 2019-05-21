import React, { Component } from 'react';
import { View, ScrollView, Image, StyleSheet, 
          Dimensions, 
          Text,
          TouchableOpacity, 
          Alert,
          Slider } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FileSystem, Constants, Notifications } from 'expo';
// import { Card } from 'react-native-elements';
// import { Player } from 'react-native-audio-player-recorder-no-linking';

import { withNavigation } from 'react-navigation';

const { width } = Dimensions.get('window');
const height = width * 0.8

class LibraryCarousel extends React.Component {

  async _downloadBook (audioURL) {
    // fileURL = audioURL.AudioURL;
    let filePath = audioURL.AudioURL;

    let fileExt = filePath.substring(filePath.length - 4, filePath.length);
    var fileName = audioURL.Title.split(' ').join('');
    console.log('Finished downloading to ', fileName);
    let fileUri = FileSystem.documentDirectory + 'assets/download/'+ fileName + fileExt;
    
   
    FileSystem.downloadAsync(
      audioURL.AudioURL,
      fileUri
    ).then(({ uri }) => {
      console.log('Finished downloading to ', uri);
      Alert.alert(audioURL.Title + ' download complete');
      const localnotification = {
        title: 'Download has finished',
        body: fileName + " has been downloaded. Tap to open file.",
        android: {
          sound: true,
        },
        ios: {
          sound: true,
        },

        data: {
          fileUri: uri
        },
      };
      localnotification.data.title = localnotification.title;
      localnotification.data.body = localnotification.body;
      let sendAfterFiveSeconds = Date.now();
      sendAfterFiveSeconds += 3000;

      const schedulingOptions = { time: sendAfterFiveSeconds };
      Notifications.scheduleLocalNotificationAsync(
        localnotification,
        schedulingOptions
      );
    })
    .catch(error => {
        console.error(error);
        Alert.alert(error);
    });

  }

  render() {
    const { book } = this.props;

    //console.log('images =:' +  this.props);
    if (book && book.length) {
      return (
        <View
          style={styles.scrollContainer}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {book.map((bookDetails, i) => ( 
              <View key={i} style={styles.container}>
              <Image
                resizeMode="stretch"
                style={{ width: 300, height: 300, 
                  paddingLeft: 20, paddingRight:20,
                  borderWidth:10,
                  borderColor:'#fff' }}
                source={{ uri: bookDetails.ImageURL}}
                
              />
          <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Player', {book:bookDetails})}>
                        <Ionicons name="md-play-circle" size={30} color="#2e78b7" />
                    </TouchableOpacity>
                    <Text>   </Text>
                    <TouchableOpacity onPress={()=> this._downloadBook(bookDetails)} >
                        <Ionicons name="md-download" size={30} color="#2e78b7" />
                    </TouchableOpacity>
        </View>
       
       
      </View>
     
            ))}
          </ScrollView>
        </View>
      );
    }
    Alert.alert('You have no books in your library!!');
    console.log('Please provide images');
    return null;    
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width,
      height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContainer: {
      height,
    },
    image: {
      width : 50,
      height : 50,
    },
  });

  export default withNavigation(LibraryCarousel);