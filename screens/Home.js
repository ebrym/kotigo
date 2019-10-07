import React from 'react';
import { StyleSheet, Dimensions, ScrollView,Image,
  ActivityIndicator,ListView,View,FlatList,
  AsyncStorage, } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product } from '../components/';
import  API  from '../constants/globalURL';

import products from '../constants/products';
const { width } = Dimensions.get('screen');

const ACCESS_TOKEN = 'access_token';
export default class Home extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      dataSource: null,
      isLoading: true,
      dataLength:0,
    };
  }
  async _fetchData() {
        
    let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
  
    fetch(API.URL + '/BookStore/GetBooks',{
        method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }})
      .then(response => response.json())
      .then(responseJson => {
        //console.error('RESPONSE  : ' + responseJson);
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson.BookStore,
          },
        
        );
            var lend = this.state.dataSource.length;
            if(lend % 2 > 0){
              this.state.dataSource.push(products[0]);
            }
      })
      .catch(error => {
        this.setState({isLoading: false});
        this.refs.toast.show('No Internet Connection!');
      });
  }

 
  componentDidMount() {
    //console.log('API : '+ API.URL);
    this._fetchData();
  }
  renderProducts = () => {
   
    return (
      <Block flex>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
 
          <Block flex>
          <FlatList  
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
         
          {/* <Product product={products[3]} horizontal />
          <Product product={products[4]} full /> */}
        
      </ScrollView>
      </Block>
    )
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
