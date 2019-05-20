import React from 'react';
import { Text, View, StyleSheet, FlatList, Image,Alert,
  ActivityIndicator, Platform, ScrollView,ListView,
AsyncStorage,TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LibraryCarousel from '../components/LibraryCarousel';
//import RNFetchBlob from 'react-native-fetch-blob'

const ACCESS_TOKEN = 'access_token';
export default class LibraryScreen extends React.Component {
  static navigationOptions = {
    title: 'MY BOOKS',
  };
  constructor(props) {
    super(props);
    this.fetchMore = this._fetchMore.bind(this);
    this.fetchData = this._fetchData.bind(this);
    this.state = {
      dataSource: null,
      isLoading: true,
      isLoadingMore: false,
      _data: null,
      _dataAfter: '',
    };

  }
  

  
async _fetchData  (callback) {
        let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
        //Limits fetches to 15 so there's lesser items from the get go
        global.token = await AsyncStorage.getItem(ACCESS_TOKEN);

     const userDetails = JSON.parse(global.userDetails);
        try{ 
          fetch('http://216.10.247.42:8089/api/BookShelf/GetUserBooks/' + userDetails.Email,{
          method: 'GET',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + token,
                  }
        })
          .then(response => response.json())
          .then(callback)
          .catch(error => {
            console.error(error);
          });
        }
        catch(error) {
          Alert.alert('Connection Error, Try again later!!');
                  
          console.log("Something went wrong");
      }
         // console.log(response.json())
      }
    
      _fetchMore() {
      try{
        this.fetchData(responseJson => {
          const data = this.state._data.concat(responseJson.BookStore);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isLoadingMore: false,
            _data: data,
            _dataAfter: responseJson.BookStore.after,
          });
        });
      }
    catch(error) {
      Alert.alert('Connection Erro, Try again later!!');
              
      console.log("Something went wrong")
    }
  }
  componentDidMount() {
    //Start getting the first batch of data from reddit
    this.fetchData(responseJson => {
      
      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      });
      const data = responseJson.BookStore;
      //console.log('data =:' +  data);
      this.setState({
        dataSource: ds.cloneWithRows(data),
        isLoading: false,
        _data: data,
        _dataAfter: responseJson.BookStore.after,
      });
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
        <View style={styles.detailCell}>
                <LibraryCarousel book={this.state._data} />
       
                {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate('Player')}>
                        <Ionicons name="md-play-circle" size={30} color="#2e78b7" />
                    </TouchableOpacity> */}
        {/* <ListView style={styles.list} contentContainerStyle={{}}
          dataSource={this.state.dataSource}
          renderRow={rowData => {
            return (

                <View style={styles.detailCell}>
                <Image  style={styles.photo}
                                source={{
                                  uri: rowData.ImageURL === '' ||
                                    rowData.ImageURL === null
                                    ? 'https://via.placeholder.com/70x70.jpg'
                                    : rowData.ImageURL,
                                }}
                              />
                  <View style={styles.rightContainer}>
                    <Text style={styles.bookTitle}>{rowData.Title}</Text>
                    <Text style={styles.bookAuthor}> Author: {rowData.Author} narrated by : {rowData.Narrator}</Text>
                  </View>
                  <View style={styles.downloadSection}>
                    <TouchableOpacity >
                        <Ionicons name="md-play-circle" size={30} color="#2e78b7" />
                    </TouchableOpacity>
                    <Text>   </Text>
                    <TouchableOpacity 
                    onPress={()=> this._downloadBook(rowData)} >
                        <Ionicons name="md-download" size={30} color="#2e78b7" />
                    </TouchableOpacity>
                </View>

                </View>



                
           
            );
          }}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      
          // onEndReached={() =>
          //   this.setState({ isLoadingMore: true }, () => this.fetchMore())}
          // renderFooter={() => {
          //   return (
          //     this.state.isLoadingMore &&
          //     <View style={{ flex: 1, padding: 10 }}>
          //       <ActivityIndicator size="small" />
          //     </View>
          //   );
          // }}
        /> */}
       </View>
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
  borderColor: 'lightgray'
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
});

