import React from 'react';
import { View,ScrollView, StyleSheet,
    AsyncStorage,
    Platform } from 'react-native';
import {WebView} from 'react-native-webview';


    import { Button, Block, Text, Input, theme } from 'galio-framework';
    import API  from '../constants/globalURL';
const ACCESS_TOKEN = 'access_token';


export default class FlutterPaymentScreen extends React.Component {
    static navigationOptions = {
        title: 'Payment',
    };
    constructor(props) {
        super(props);
      }
     
      
    render() {
        //let token = Storage.(ACCESS_TOKEN);
            
            //console.log('payment ' + global.token);  
            const { navigation } = this.props;
            const bookDetails=navigation.getParam('paymentDetails');
            //console.log("book details " + bookDetails);  
            const BookID=bookDetails.Id;


            const Title=bookDetails.Title;
            const Price= parseFloat(bookDetails.Price) ;
            const userDetails = JSON.parse(global.userDetails);
            const transactionNo = 'GO' + Math.floor((Math.random() * 10000000000) + 1);
           // console.log(userDetails);  
           // console.log('TransRef : ' + transactionNo);  

           
           let html = '<html><head>';
           html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
           html += ' <script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>   ';              
           html += '<style>img { width:100%; }</style></head>';        
           html += '<body onload="payWithRave();" >             ';    
           html += '<div id="resultSuccess" ';
           html += 'style="text-decoration-color: green"></div> ';
           html += '<div id="resultFail" style="text-decoration-color: red"></div> ';                     
           html += '<script>                                ';
           html += 'const API_publicKey = "' + API.FLUTTERWAVE_LIVE_PUBLIC_KEY + '";';
               
           html += 'function payWithRave() {'; 
           html += 'var x = getpaidSetup({'; 
           html += 'PBFPubKey: API_publicKey,'; 
           html += 'customer_email: \'' + userDetails.Email +'\',    ';     
           html += 'amount: ' + Price + ',     ';
           html += 'customer_phone: "070",'; 
           html += 'currency: "NGN",'; 
           html += 'txref:"' + transactionNo + '",  ';
           html += 'meta: [{'; 
           html += 'metaname: "BOOK TITLE",  '; 
           html += 'metavalue: "' + Title + '"     ';     
           html += '}],'; 
           html += 'onclose: function() {},'; 
           html += 'callback: function(response) {'; 
           html += '    var txref = response.tx.txRef; ';
           html += '   console.log("This is the response returned after a charge", response);';
           html += 'if (';
           html += '    response.tx.chargeResponseCode == "00" ||';
           html += '   response.tx.chargeResponseCode == "0"';
           html += ') {';
                           // redirect to a success page
                           html += ' var paymentDetails = {   '; 
                           html += ' BookID:' + BookID + ',            ';        
                           html += 'Reference: "' + transactionNo + '",';
                           html += 'UserName: "' + userDetails.Email + '",     ';    
                           html += ' Amount: "' + Price + '", '; 
                           html += 'PaymentMode: "flutter-card",  ';  
                           html += 'Status: "success"      ';  
                           html += '};            ';  
                           html += 'var json = JSON.stringify(paymentDetails); ';  
                           html += 'postPaymentData(json); ';  
                           html += '} else {';  
                           // redirect to a failure page.
                           html += '}';  
       
                           html += 'x.close(); ';  
                           html += ' }';  
                           html += '});';  
                           html += '}';  




                           html += ' function postPaymentData(paymentDetals) {      ';                               
                           html += '$.ajax({                       ';                   
                           html += '  url: "' + API.URL + '/Payment/PaymentUpdate", '; 
                           html += '  type: "POST",      ';            
                           html += 'data: paymentDetals,    ';      
                           html += 'contentType: "application/json; charset=utf-8",  ';
                           html += 'dataType: "json",       ';                       
                           html += ' beforeSend: function (xhr) {    ';          
                           html += '   xhr.setRequestHeader ("Authorization", "Bearer ' + global.token +'");  ';  
                           html += '                                   },     ';         
                           html += 'success: function(result){        ';
                           html += ' $("#resultSuccess").html(result);                                    }}); ';
                           html += '}</script> </body></html>';
         


                                                            console.log(html);  
        return (  
            <Block flex style={styles.container}>
              <WebView
                    originWhitelist={['*']}
                    source={{html: html}}
                    injectedJavaScript={`const meta = document.createElement('meta'); 
                                        meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); 
                                        meta.setAttribute('name', 'viewport'); 
                                        document.getElementsByTagName('head')[0].appendChild(meta); 
                                        true;`}
                    style={{ flex: 1 }}
                    //scalesPageToFit={Platform.OS === 'ios' ? false : true}
                    //style={{marginTop: 20,padding:20, width:Platform.OS === 'ios' ? 90 : 350, borderColor:'#f234de', borderWidth:1}}
      
          />
       </Block>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? theme.SIZES.BASE / 2 : theme.SIZES.BASE * 7,
  },
 
});
