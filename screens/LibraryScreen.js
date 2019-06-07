import React from 'react';
import {  View, StyleSheet, FlatList, Image,Alert,
  ActivityIndicator, Platform, ScrollView,ListView,
AsyncStorage,TouchableOpacity, Dimensions, NetInfo} from 'react-native';
import { FileSystem, Constants, Notifications,SQLite } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import LibraryCarousel from '../components/LibraryCarousel';

//import { sliderWidth, itemWidth } from '../constants/SliderEntry.Style';
//import RNFetchBlob from 'react-native-fetch-blob'
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { Images, materialTheme } from '../constants';



const { width, height } = Dimensions.get('screen');

const ACCESS_TOKEN = 'access_token';



const db = SQLite.openDatabase('gosmarticle.db');

export default class LibraryScreen extends React.Component {
  static navigationOptions = {
    title: 'MY BOOKS',
  };
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: true,
    };
}
async _fetchData() {
      
  let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
  //Limits fetches to 15 so there's lesser items from the get go
  //global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
  let userDetail =  await AsyncStorage.getItem('UserDetails');
 
const userDetails = JSON.parse(userDetail);
console.log('Library Screen : ' + userDetails.Email);

fetch('http://216.10.247.42:8089/api/BookShelf/GetUserBooks/' + userDetails.Email,{
      method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token,
              }})
    .then(response => response.json())
    .then(responseJson => {
      this.setState(
        {
          isLoading: false,
          data: responseJson.BookStore,
        }
      );
    })
    .catch(error => {
      Alert.alert('Connection Error, Try again later!!');
      console.error(error);
    });
}


componentDidMount() {
  console.log(global.connectionState);
  if (global.connectionState){
    this._fetchData();
  }else{
   this._fetchOfflineData();
  }
}


    //(_, { rows: { _array } }) => this.setState({ items: _array })
    // console.log(JSON.stringify(_array))
  _fetchOfflineData(){
   db.transaction((tx) => {
    tx.executeSql('select * from Library', [], (_, { rows }) =>
    this.setState(
      {
        isLoading: false,
        data: rows._array,
      }
    )
      );
    
    console.log('table created');
  }, null, function () {
    console.log('done?.');
  });
 }

 



  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <Block flex style={styles.options}>
                <LibraryCarousel book={this.state.data} />
       </Block>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    paddingTop: 20,
    marginTop:theme.SIZES.BASE * 7,
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

list: {
  flex:1,
  width:'100%'
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

},photo: {
  height: 40,
  width: 40,
  borderRadius: 20,
},
text: {
  marginLeft: 12,
  fontSize: 16,
  flex: 1,
  borderBottomWidth: .5,
  borderColor: 'lightgray',
},separator: {
  flex: 1,
  height: StyleSheet.hairlineWidth,
  backgroundColor: '#8E8E8E',
},
detailCell: {
  flex: 1,
  flexDirection:'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 4,
  marginRight: 4,
  padding: 5,
  borderBottomWidth: .5,
  borderColor: 'lightgray',
},
bookTitle: {
  fontSize: 13,
  marginBottom: 8,
  textAlign: 'left',
},
bookAuthor: {
  fontSize: 10,
  marginBottom: 6,
  textAlign: 'left',
},
rightContainer: {
  flex: 1,
},
downloadSection: {
  flexDirection: 'row', 
  padding:5,
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

