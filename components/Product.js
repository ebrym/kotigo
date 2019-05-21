import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import materialTheme from '../constants/Theme';

const { width } = Dimensions.get('screen');

class Product extends React.Component {
  render() {
    const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
const { book } = this.props;
console.log("Something went wrong" + product.Title);
    return (
      //book.map((bookDetails, i) => ( 
      <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
     
        <TouchableWithoutFeedback onPress={() => navigation.navigate('BookDetails', { book: product })}>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            {/* <Image source={{ uri: product.image }} style={imageStyles} /> */}
            <Image source={{ uri: product.ImageURL }} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('BookDetails', { book: product })}>
          <Block flex space="between" style={styles.productDescription}>
            <Text size={14} style={styles.productTitle}>{product.Title}</Text>
            <Block flex  row space="between">
              <Text size={12} muted={!priceColor} color={priceColor} >{product.Author}</Text>
              <Text size={10} muted={!priceColor} color="green">N{product.Price}</Text>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
        
      </Block>
     //  ))
    );
  }
}

export default withNavigation(Product);

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
    height: 122,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});