/*!

 =========================================================
 * Material Kit React Native - v1.1.2
 =========================================================
 * Product Page: https://demos.creative-tim.com/material-kit-react-native/
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-kit-react-native/blob/master/LICENSE)
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from 'react';
import { Platform, StatusBar, Image,NetInfo } from 'react-native';
import { AppLoading, Asset } from 'expo';
import { Block, GalioProvider } from 'galio-framework';

import Screens from './navigation/Screens';
import Offline from './navigation/OfflineNav';
import { Images, products, materialTheme } from './constants/';
import Toast, {DURATION} from 'react-native-easy-toast'



// cache app images
const assetImages = [
  Images.Pro,
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
];

// cache product images
products.map(product => assetImages.push(product.image));
products.map(product => assetImages.push(product.ImageURL));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
      connection: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={materialTheme}>
        <Toast ref="toast"/>
          <Block flex>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {this.state.connection  ? <Screens /> : <Offline />}
          </Block>
        </GalioProvider>
      );
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange
    );

   
  }
  

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  handleConnectionChange = isConnected => {
    console.log('Connection state : ' + isConnected); // gives undefined in log
    if(!isConnected){
      this.refs.toast.show('No Internet Connection!');
    }else{
      this.refs.toast.show('Internet Connection!');
     
    }
    this.setState({
      connection: isConnected,
    });
    global.connectionState = isConnected;
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    //console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
