import React, { Component } from 'react';
import { View, ScrollView, Image, StyleSheet, 
          Dimensions, 
          TouchableOpacity, 
          Alert,
          Slider,NetInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FileSystem, Constants, Notifications,SQLite } from 'expo';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import Carousel , { Pagination } from 'react-native-snap-carousel';
import * as Progress from 'react-native-progress';
// import styles, { colors } from '../styles/corosel.styles';
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import { Card } from 'react-native-elements';
// import { Player } from 'react-native-audio-player-recorder-no-linking';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { withNavigation } from 'react-navigation';
export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD'
};
const { width } = Dimensions.get('window');
const height = width * 0.8

const db = SQLite.openDatabase('gosmarticle.db');
class LibraryCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreparingDb: true,
      bookdetails: null,
      downloaded: false,
      downloadstatus :false,
      downloading :false,
      currentDownload :"",
      progress: 0,
      indeterminate: true,
    };
  }
  componentDidMount() {
    //this.DropTableDb();
    this.prepareDb();
    
 }

  prepareDb() {
    db.transaction((tx) => {
      tx.executeSql('create table if not exists Library (id INTEGER PRIMARY KEY, BookID INTEGER, Title text, ImageURL text);');
      tx.executeSql('create table if not exists BookChapter (id INTEGER PRIMARY KEY, BookID INTEGER, ChapterNo INTEGER,ChapterName TEXT, AudioURL text);');
      
      console.log('table created');
    }, null, function () {
      console.log('done?.');
    });
    this.setState({ isPreparingDb: false });
  }


  DropTableDb() {
    db.transaction((tx) => {
      tx.executeSql('drop table Library;');
      tx.executeSql('drop table BookChapter;');
      console.log('table dropped');
    }, null, function () {
      console.log('done?.');
    });
    this.setState({ isPreparingDb: false });
  }



   renderDownload =(item)=> {
    let bookID = 0;
   
    
    if (global.connectionState){
       bookID = item.Id;
      }else{
        bookID = item.BookID;
      }
     // console.log('offline data 1 : ' + bookID);
      db.transaction( async (tx) => {
       tx.executeSql('select * from Library where BookID = ?' , [bookID], (tx, results) =>
      {
        var len = results.rows.length;
        console.log('results - ' + JSON.stringify(results));
        if (len > 0) {
          this.setState({ downloaded: true,
                          downloadstatus: true,
                        });
        } 
       
      }
      );
      //console.log('offline data 1 : ' + this.state.data);
    }, null, function () {
    //  console.log('done?.');
    });
    console.log('status : ' + this.state.downloadstatus);
    // if(!downloadstatus)
    // {
    // return (<TouchableOpacity onPress={()=> this._downloadBook(item)} >
    //         <Ionicons name="md-download" size={30} color="#2e78b7" />
    //     </TouchableOpacity>);
    // }
    // else{
    //   return (<Text></Text>);
    // }
  }

  async _downloadBook (audioURL) {
    this.setState({ downloading: true,
      currentDownload: audioURL.Title,
    });
    // fileURL = audioURL.AudioURL;
    let filePath = audioURL.ShortAudioURL;
    let fileExt = filePath.substring(filePath.length - 4, filePath.length);
    var fileName = audioURL.Title.split(' ').join('');
   
    //let fileUri = FileSystem.documentDirectory + 'assets/download/'+ fileName + fileExt;
    let fileUri = FileSystem.documentDirectory +  fileName + fileExt;
    

    let imagefilePath = audioURL.ImageURL;
    let imagefileExt = imagefilePath.substr(imagefilePath.lastIndexOf('.') + 1);
    var imagefileName = audioURL.Title.split(' ').join('');
    let imagefileUri = FileSystem.documentDirectory +  fileName + '.'+ imagefileExt;

 
  
  try {
    
      await FileSystem.downloadAsync(imagefilePath, imagefileUri)
      .then(() => {
        // save to db
        db.transaction(
          async tx => {
            // checking if book is in the db
                  await tx.executeSql('select * from Library where BookID = ' + audioURL.Id, [], (_, results) =>
                  {
                      var len = results.rows.length;
                      console.log('len', len);
                      if (len == 0) {
                              tx.executeSql('insert into Library (BookID, Title, ImageURL) values (?, ?, ?)', [audioURL.Id,audioURL.Title,imagefileUri]);
                      } 
                  });   
                      let chapterCount = 0;
                      let chapter = audioURL.Chapters;
                      chapterCount = chapter.length;
                      let downloadCount = 0;
                      let chapD = chapter.forEach(async obj => {
                        //let itemChunk = itemArray[i].map(async obj => {
                                let chapterPath = obj.AudioURL;
                                let chapterExt = chapterPath.substring(chapterPath.length - 4, chapterPath.length);
                                var chapterName = obj.ChapterName.split(' ').join('');
                                let chapterUri = FileSystem.documentDirectory +  obj.BookId + '_' + chapterName + chapterExt; 
                                tx.executeSql('insert into BookChapter (BookID, ChapterNo, ChapterName, AudioURL) values (?, ?, ?, ?)', [obj.BookId,obj.ChapterNo,obj.ChapterName,chapterUri]);
                                      
                                
                                await FileSystem.downloadAsync(chapterPath, chapterUri)
                                .then(({ uri }) => {
                                  
                                  console.log("download progress chapterCount. : " + chapterCount);
                                  downloadCount = downloadCount + 1;
                                  console.log("download progress downloadCount. : " + downloadCount);
                                  
                                  this.setState({progress: ((downloadCount / chapterCount)) / 1});
                                  console.log("download progress. : " + this.state.progress);
                                  //console.error("download progress fill. : " + this.state.fill);
                                  //console.error("download progress progress. : " + this.state.progress)
                                  // if(this.state.progress == 100)
                                  // {
                                  //   this.setState({progress: 0, downloading:false,});
                                  // }
                                  if(this.state.progress != 0){
                                    this.setState({ indeterminate: false });
                                  }
                                });
                              
                                
                                // await this.wait(1000);
                        });
                        await Promise.all(chapD);
                        
                },
                null,
                this.update
              );
        
          //Alert.alert(audioURL.Title + ' download complete');
      });

      if(this.state.progress == 100)
      {
        Alert.alert(audioURL.Title + ' download complete');
      }


   
  } catch (error) {
    this.setState({ downloading: true, progress:0,
      currentDownload: "",
    });
    /// Here is where i handle an asset loading error.
    console.error(error)
  }
}
_renderProgress = () => {
  return (
    <Progress.Circle
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
          />
  )
}

   _renderItem =  ({item, index})  =>{
    this.renderDownload(item);
     console.log("download status . : " + this.state.downloadstatus);
     this.setState({ downloaded: false,
      downloadstatus: false,
    });
    console.log("download status . after : " + this.state.downloadstatus);
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

        <Block style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
      
          <TouchableOpacity onPress={()=> {
            this.props.navigation.navigate('Player', {book:item});
          }}>
              <Ionicons name="md-play-circle" size={30} color="#fb8c00" />
          </TouchableOpacity>
                  <Text>   </Text>
                  {/* {this.state.downloaded && (<TouchableOpacity onPress={()=> this._downloadBook(item)} >
            <Ionicons name="md-download" size={30} color="#2e78b7" />
        </TouchableOpacity>)} */}
         {!this.state.downloading && (<TouchableOpacity onPress={()=> this._downloadBook(item)} >
                      <Ionicons name="md-download" size={30} color="#fb8c00" />
                  </TouchableOpacity>)}
               
                  
                 
                 
        </Block>
        
        </Block>
    );
}
downloadComplete()
{
  this.setState({progress: 0, downloading:false,});
  Alert.alert(this.state.currentDownload + ' download complete')
}

  render =() => {
      const { book } = this.props;
    if (book && book.length) {
      
          const { slider1ActiveSlide } = this.state;
        return (
          <Block flex style={styles.exampleContainer}>
            <Carousel
            // ref={(c) => { this._carousel = c; }}
            data={book}
            renderItem={this._renderItem}
            sliderWidth={width - (theme.SIZES.BASE * 2)}
            itemWidth={300}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            
          />
           <Block center> 
         
                   {this.state.downloading && (
                         <Progress.Circle
                         style={styles.progress}
                         progress={this.state.progress}
                         indeterminate={this.state.indeterminate}
                         direction="clockwise"
                         showsText={true}
                         color='#fb8c00'
                         size={50}
                       />)} 
                   {/* {this.state.downloading && (<Text>...please wait.</Text>)}    */}
                   {this.state.progress == 1 && (this.downloadComplete())}
             </Block>
          <Pagination
          dotsLength={book.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'rgba(255, 255, 255, 0.92)'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={colors.black}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
        />
        </Block>
        );s
      
    }
    Alert.alert('You have no books in your library!!');
    console.log('Please provide images');
    return null;    
  }
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
},
container: {
    flex: 1,
    backgroundColor: colors.background1,
    flex: 1,
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
},
gradient: {
    ...StyleSheet.absoluteFillObject
},
scrollview: {
    flex: 1
},
exampleContainer: {
    paddingVertical: 30
},
exampleContainerDark: {
    backgroundColor: colors.black
},
exampleContainerLight: {
    backgroundColor: 'white'
},
title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
},
titleDark: {
    color: colors.black
},
subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center'
},
slider: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
},
sliderContentContainer: {
    paddingVertical: 10 // for custom animation
},
paginationContainer: {
    paddingVertical: 8
},
paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
},
  scrollContainer: {
    height,
  },
  image: {
    width : 50,
    height : 50,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
  });

  export default withNavigation(LibraryCarousel);