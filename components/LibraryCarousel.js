import React, { Component } from 'react';
import { View, ScrollView, Image, StyleSheet, 
          Dimensions, 
          TouchableOpacity, 
          Alert,
          Slider,NetInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FileSystem, Constants, Notifications,SQLite } from 'expo';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import Carousel from 'react-native-snap-carousel';
// import { Card } from 'react-native-elements';
// import { Player } from 'react-native-audio-player-recorder-no-linking';

import { withNavigation } from 'react-navigation';

const { width } = Dimensions.get('window');
const height = width * 0.8

const db = SQLite.openDatabase('gosmarticle.db');
class LibraryCarousel extends React.Component {
  constructor() {
    super();
    this.state = {
      isPreparingDb: true,
      bookdetails: null,
    };
  }
  componentDidMount() {
    this.prepareDb();
   
 }

  prepareDb() {
    db.transaction((tx) => {
      tx.executeSql('create table if not exists Library (id INTEGER PRIMARY KEY, BookID INTEGER, Title text, ImageURL text, AudioURL text);');
    //   tx.executeSql('select * from Library', [], (_, { rows: { _array } }) =>
    //   this.setState(
    //   {
    //     bookdetails: JSON.stringify(_array),
    //   }
    // )
    // // console.log(JSON.stringify(_array))
    //   );
      
      console.log('table created');
    }, null, function () {
      console.log('done?.');
    });
    this.setState({ isPreparingDb: false });
  }


  DropTableDb() {
    db.transaction((tx) => {
      tx.executeSql('drop table Library;');
      console.log('table dropped');
    }, null, function () {
      console.log('done?.');
    });
    this.setState({ isPreparingDb: false });
  }


  async _downloadBook (audioURL) {
    // fileURL = audioURL.AudioURL;
    let filePath = audioURL.AudioURL;
    let fileExt = filePath.substring(filePath.length - 4, filePath.length);
    var fileName = audioURL.Title.split(' ').join('');
    console.log('Finished downloading to ');
    //let fileUri = FileSystem.documentDirectory + 'assets/download/'+ fileName + fileExt;
    let fileUri = FileSystem.documentDirectory + 'assets/'+ fileName + fileExt;
    

    let imagefilePath = audioURL.ImageURL;
    let imagefileExt = imagefilePath.substr(imagefilePath.lastIndexOf('.') + 1);
    var imagefileName = audioURL.Title.split(' ').join('');
    let imagefileUri = FileSystem.documentDirectory + 'assets/'+ fileName + '.'+ imagefileExt;



  try {
    // await Promise.all(audioAssets);

    // await Promise.all(imageAssests);
    await FileSystem.downloadAsync(filePath, fileUri)
    await FileSystem.downloadAsync(imagefilePath, imagefileUri)
   


    // save offiline
    db.transaction(
      tx => {
        tx.executeSql('insert into Library (BookID, Title, ImageURL,AudioURL) values (?, ?, ?, ?)', [audioURL.Id,fileName, imagefileUri, fileUri]);
        // tx.executeSql('select * from Library', [], (_, { rows }) =>
        //   console.log(JSON.stringify(rows))
        // );
      },
      null,
      this.update
    );
    Alert.alert(audioURL.Title + ' download complete');
  } catch (error) {
    /// Here is where you would handle an asset loading error.
    console.error(error)
  }


   


  }

  _renderItem =({item, index})  =>{
    //console.log(item.ImageURL);
    //var img = global.connectionState ? item.ImageURL : require(item.ImageURL);
    // if (!global.connectionState){
    //   let options = { encoding: FileSystem.EncodingTypes.Base64 };
    //   FileSystem.readAsStringAsync(item.ImageURL, options).then(data => {
    //               const base64 = 'data:image/jpg;base64' + data;
    //               resolve(base64); // are you sure you want to resolve the data and not the base64 string? 
    //           }).catch(err => {
    //               console.log("​getFile -> err", err);
    //               reject(err) ;
    //           });
    //   }
    return (
        <Block flex center style={styles.slide} key={index} >
          <Image
              resizeMode="stretch"
              style={{ width: 300, height: 300, 
                paddingLeft: 20, paddingRight:20,
                borderWidth:10,
                borderColor:'#fff' }}
              source={{uri: item.ImageURL}}
            />

        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
      
          <TouchableOpacity onPress={()=> {
          //  Alert.alert(item.ImageURL + ' download complete');
            this.props.navigation.navigate('Player', {book:item});
          }
            }>
                      <Ionicons name="md-play-circle" size={30} color="#2e78b7" />
                  </TouchableOpacity>
                  <Text>   </Text>
                  <TouchableOpacity onPress={()=> this._downloadBook(item)} >
                      <Ionicons name="md-download" size={30} color="#2e78b7" />
                  </TouchableOpacity>
        </View>
        
        </Block>
    );
}

  render =() => {
    
    
    const { book } = this.props;

     //let book  = this.props;
    
     
    // if (!global.connectionState){
    //   //book = this.state.bookdetails;
    //   //console.log('images carousel =:' +  book);
    //   console.log('images carousel from db =' +  JSON.stringify(book));
    // }else{
    //   console.log('images carousel from props =' +  JSON.stringify(book));
    // }

    

    if (book && book.length) {
      
        return (
            <Carousel
            ref={(c) => { this._carousel = c; }}
            data={book}
            renderItem={this._renderItem}
            sliderWidth={width - (theme.SIZES.BASE * 2)}
            itemWidth={300}
          />
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