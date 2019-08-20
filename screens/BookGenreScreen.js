import React from 'react';
import { StyleSheet, Dimensions, ScrollView,TouchableWithoutFeedback,
  ActivityIndicator,ListView,View,FlatList,ImageBackground,
  AsyncStorage, } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import  Genre from '../components/Genre';

import { Images, materialTheme } from '../constants';
import  API  from '../constants/globalURL';
import Toast, {DURATION} from 'react-native-easy-toast'
const { width } = Dimensions.get('screen');

const ACCESS_TOKEN = 'access_token';
export default class BookGenreScreen extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      dataSource: null,
      isLoading: true,
    };
  }
  async _fetchData() {
        
    let token =  await AsyncStorage.getItem(ACCESS_TOKEN);
  
    fetch(API.URL + '/setup/gernes',{
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
            dataSource: responseJson.Gerne,
          },
        
        );
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
    //console.log(this.state.dataSource);
    return (
      <Block flex>
   
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
 
          <Block flex row>
          <FlatList  
          data={this.state.dataSource}
          numColumns='1'
    
          renderItem={({ item }) => (
            //<Category category={item} style={{ margin: 5 }} full />
            // <Genre product={item} horizontal full />
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Search', { genre: item, searchtype:"gerne"})}>
          <Block flex card style={[styles.imageContainer, styles.shadow]}>
            <ImageBackground source={(item.BannerName != null ? {uri: item.BannerName} : require('../assets/images/gosmarticlelogo.png'))}
            style={ { width: width - (theme.SIZES.BASE * 2), height: 100, marginBottom:5, marginTop:5 }}>
            <Text size={12}  >{item.Name}</Text>
            </ImageBackground>
            
          </Block>
        </TouchableWithoutFeedback>
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
  },shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
