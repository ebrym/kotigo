import React from 'react';
import { Text, View, StyleSheet, FlatList, Image,
        ActivityIndicator, Platform, ScrollView,
    AsyncStorage,TouchableOpacity} from 'react-native';

import { SearchBar } from 'react-native-elements';




const ACCESS_TOKEN = 'access_token';

export default class SearchScreen extends React.Component {
    static navigationOptions = {
      title: 'Browse Books',
    };
  
    constructor(props) {
        super(props);
        //setting default state
        this.state = { isLoading: true, search: '' };
        this.arrayholder = [];
      }

    componentDidMount() {
       this._fetchData();
      }

      async _fetchData() {
        
        let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
        fetch('http://216.10.247.42:8089/api/BookStore/GetBooks',{
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
                dataSource: responseJson.BookStore,
              },
              function() {
                this.arrayholder = responseJson.BookStore;
                console.log("rese is:" + responseJson);
              }
            );
          })
          .catch(error => {
            console.error(error);
          });
      }
      
      search = text => {
        console.log(text);
      };
      clear = () => {
        this.search.clear();
      };
      SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function(item) {
          //applying filter for the inserted text in search bar
          const itemData = item.Title ? item.Title.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          dataSource: newData,
          search:text,
        });
      }
    //   ListViewItemSeparator = () => {
    //     //Item sparator view
    //     return (
    //       <View
    //         style={{
    //           height: 0.3,
    //           width: '90%',
    //           backgroundColor: '#080808',
    //         }}
    //       />
    //     );
    //   };
   
  render() {
    if (this.state.isLoading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator size="large"  />
        </View>
      );
    }
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.viewStyle}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder="Type Here..."
          value={this.state.search}
          />
             <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
          <FlatList style={styles.list}  
          numColumns='2'
          data={this.state.dataSource}
          //ItemSeparatorComponent={this.ListViewItemSeparator}
          //Item Separator View
    
          renderItem={({ item }) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <TouchableOpacity style={styles.card}  
            onPress={()=> this.props.navigation.navigate('BookDetails',{bookList:item})} 
                
                //onPress={this._gotoDetialsScreen(item)}
                key = {item.Id}>
                <View style={styles.listItem}>
                  <View style={styles.imageWrapper}>
                    <Image  style={styles.cardImage}
                      source={{
                        uri: item.ImageURL === '' ||
                        item.ImageURL === null
                          ? 'https://via.placeholder.com/70x70.jpg'
                          : item.ImageURL,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardText}>
                      {item.Title}
                    </Text>
                    <View style={styles.cardTextDetails}>
                    <Text  style={styles.cardTextTiny}>{item.Author}</Text>
                      <Text style={styles.cardTextTiny}>N{item.Price}</Text>
                    </View>
                  </View>
                </View>
                </TouchableOpacity>
          )}
          enableEmptySections={true}
          style={{ marginTop: 5 }}
          keyExtractor={(item, index) => index.toString()}
        />
        </ScrollView>
      </View>
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
    viewStyle: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor:'white',
        marginTop: Platform.OS == 'ios'? 30 : 0
      },
      textStyle: {
        padding: 7,
      },
      card:{
        backgroundColor:'#fff',
        marginBottom:10,
        marginLeft:'2%',
        width: '45%', 
        aspectRatio: 1,
        shadowColor:'#000',
        shadowOpacity:0.2,
        shadowRadius:1,
        borderRadius: 5,
        shadowOffset:{
          width:3,
          height:3
        }
      },
      cardImage:{
        width:'100%',
        height:'90%',
        resizeMode:"stretch",
        borderRadius: 5,
      },
      cardText : {
        padding:5,
        fontSize:10
      },cardTextDetails : {
        flexDirection: 'row',
        alignContent:'space-between',
        alignItems:'stretch'
      },
      cardTextTiny : {
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
      
      }
  });
  