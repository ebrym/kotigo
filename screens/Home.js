import React from 'react';
import { StyleSheet, Dimensions, ScrollView,
  ActivityIndicator,ListView,View,FlatList,
  AsyncStorage, } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product } from '../components/';

const { width } = Dimensions.get('screen');
import products from '../constants/products';

const ACCESS_TOKEN = 'access_token';
export default class Home extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      dataSource: null,
      isLoading: true,
    };
  }
  async _fetchData() {
        
    let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.token = await AsyncStorage.getItem(ACCESS_TOKEN);
    // global.userDetails = await AsyncStorage.getItem("UserDetails");
    //console.log( global.userDetails);
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
        
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

 
  componentDidMount() {
    this._fetchData();
  }

  // renderSearch = () => {
  //   const { navigation } = this.props;
  //   const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="camera-18" family="GalioExtra" />

  //   return (
  //     <Input
  //       right
  //       color="black"
  //       style={styles.search}
  //       iconContent={iconCamera}
  //       placeholder="What are you looking for?"
  //       onFocus={() => navigation.navigate('Pro')}
  //     />
  //   )
  // }
  
  // renderTabs = () => {
  //   const { navigation } = this.props;

  //   return (
  //     <Block row style={styles.tabs}>
  //       <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
  //         <Block row middle>
  //           <Icon name="grid-square" family="Galio" style={{ paddingRight: 8 }} />
  //           <Text size={16} style={styles.tabTitle}>Categories</Text>
  //         </Block>
  //       </Button>
  //       <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
  //         <Block row middle>
  //           <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
  //           <Text size={16} style={styles.tabTitle}>Best Deals</Text>
  //         </Block>
  //       </Button>
  //     </Block>
  //   )
  // }

  renderProducts = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          {/* <Product product={products[0]} horizontal /> */}
          <Block flex row>
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
          </Block>
          {/* <Product product={products[3]} horizontal />
          <Product product={products[4]} full /> */}
        
      </ScrollView>
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
