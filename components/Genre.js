import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback,TouchableOpacity,ImageBackground } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import materialTheme from '../constants/Theme';

const { width } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;
class Genre extends React.Component {
  render() {
    const { navigation, product, horizontal, full, style, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];


    return (
      //book.map((bookDetails, i) => ( 
      <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
     
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Search', { book: product })}>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            <ImageBackground source={(product.BannerName != null ? {uri: product.BannerName} : require('../assets/images/gosmarticlelogo.png'))}
            style={ { width: width - (theme.SIZES.BASE * 2), height: 100 }}>
            <Text size={12}  >{product.Name}</Text>
            </ImageBackground>
            
          </Block>
        </TouchableWithoutFeedback>
        {/* <TouchableWithoutFeedback onPress={() => navigation.navigate('BookDetails', { book: product })}>
          <Block flex space="between" style={styles.productDescription}>
            <Text size={14} style={styles.productTitle}>{product.Title}</Text>
            <Block flex  row space="between">
              <Text size={12} muted={!priceColor} color={priceColor} >{product.Author}</Text>
             
              {product.Price >0 ? <Text size={10} muted={!priceColor} color="green"> N{product.Price}</Text> :  <TouchableOpacity style={styles.pro}>
                <Text  style={styles.buttonText} color={theme.COLORS.WHITE} size={10}>Free</Text>
            </TouchableOpacity>}
            </Block>
          </Block>
        </TouchableWithoutFeedback> */}
        
      </Block>
     //  ))
    );
  }
}

export default withNavigation(Genre);

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
    width:'100%',
    height:'90%',
    resizeMode:"stretch",
  },
  horizontalImage: {
    height: 150,
    width: 'auto',
  },
  fullImage: {
    height: 100,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.BUTTON_COLOR,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    width:'auto',
  },
});

