import React from 'react';
import { StyleSheet, Dimensions, ScrollView,
  ActivityIndicator,ListView,View,FlatList,
  AsyncStorage,Platform } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product } from '../components/';
import API from '../constants/globalURL';
const { width } = Dimensions.get('screen');

import products from '../constants/products';
const ACCESS_TOKEN = 'access_token';
export default class Home extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      dataLenght: false,
      dataSource: null,
      isLoading: true,
    };
  }

  async _fetchData() {
    const { navigation } = this.props;
    const keyword = navigation.getParam('search');
    //const keyword = navigation.state.SearchText;
    //console.log("SearchText : " +keyword);
    
    let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.userDetails = await AsyncStorage.getItem("UserDetails");
   
    fetch(API.URL + '/BookStore/SearchBooks/' + keyword ,{
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
        
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  async _fetchGenreData() {
    const { navigation } = this.props;
    const keyword = navigation.getParam('genre');
    //const keyword = navigation.state.SearchText;
    //console.log("SearchText : " +keyword.Id);
    
    let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.userDetails = await AsyncStorage.getItem("UserDetails");
   
    fetch(API.URL + '/BookStore/GetBooksByGenre/' + keyword.Id,{
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
        
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  async _fetchCategoryData() {
    const { navigation } = this.props;
    const keyword = navigation.getParam('genre');
    //const keyword = navigation.state.SearchText;
    //console.log("SearchText : " +keyword.Id);
    
    let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.userDetails = await AsyncStorage.getItem("UserDetails");
   
    fetch(API.URL + '/BookStore/GetBooksByCategory/' + keyword.Id,{
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
        
        );
        
      })
      .catch(error => {
        console.error(error);
      });
  }
 
  componentDidMount() {
    const { navigation } = this.props;
    const searchtype = navigation.getParam('searchtype');

    //console.log("search type : " + searchtype);
    if(searchtype=="gerne")
    {
      this._fetchGenreData();
    }else if(searchtype=="category")
    {
      this._fetchCategoryData();
    }else{
      this._fetchData();
    }
    
   
  }



  renderProducts = () => {
      var lend = this.state.dataSource.length;
      if(lend % 2 > 0){
        this.state.dataSource.push(products[0]);
      }
      return (
        <Block flex >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}>
          <Block flex>
            {/* <Product product={products[0]} horizontal /> */}
            <Block flex>
            <FlatList 
            columnWrapperStyle={{alignItems:'flex-start' }} 
            data={this.state.dataSource}
            numColumns='2'
            renderItem={({ item }) => (
                  <Product product={item} style={{ margin: 5 }}/>
                  )}
                  enableEmptySections={true}
                  style={{ marginTop: 5 }}
                  keyExtractor={(item, index) => index.toString()}
                />
         
              </Block>
            </Block>
            {/* <Product product={products[3]} horizontal />
            <Product product={products[4]} full /> */}
          
        </ScrollView>
        </Block>
      )
   
   
  }

  render() {
    // var lend = this.state.dataSource.length;
    // if(lend % 2 > 0){
    //   this.state.dataSource.push(products[0]);
    // }
   
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
     // var lend = this.state.dataSource.length;
    // if(lend/2 > 0)
    // {
    //   this.setState({dataLenght: true});
    // }else{
    //   this.setState({dataLenght: false});
    // }
    // console.log("search type : " + this.state.dataLenght);
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
      </Block>
    );
    }
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    marginTop: theme.SIZES.BASE * 7,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },

});
