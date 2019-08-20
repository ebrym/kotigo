import React from 'react';
import { View,ScrollView, StyleSheet,WebView,
    AsyncStorage,
    Platform } from 'react-native';
//import {WebView} from 'react-native-webview';


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
            
            console.log('payment ' + global.token);  
            const { navigation } = this.props;
            const bookDetails=navigation.getParam('paymentDetails');
            //console.log("book details " + bookDetails);  
            const BookID=bookDetails.Id;


            const Title=bookDetails.Title;
            const Price= parseFloat(bookDetails.Price) ;
            const userDetails = JSON.parse(global.userDetails);
            const transactionNo = 'GO' + Math.floor((Math.random() * 10000000000) + 1);
            console.log(userDetails);  
            console.log('TransRef : ' + transactionNo);  

            let htmlContent = '<html><head>';
            htmlContent += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
            htmlContent += ' <script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>   ';              
            htmlContent += '<style>img { width:100%; }</style></head>';        
            htmlContent += '<body onload="payWithRave();" >             ';    
            htmlContent += '<div id="resultSuccess" ';
            htmlContent += 'style="text-decoration-color: green"></div> ';
            htmlContent += '<div id="resultFail" style="text-decoration-color: red"></div> ';                     
            htmlContent += '<script>                                ';
            htmlContent += 'const API_publicKey = "FLWPUBK_TEST-97435d9b587ff66a52fefd83fff43b7b-X";';
                
            htmlContent += 'function payWithRave() {'; 
                htmlContent += 'var x = getpaidSetup({'; 
                    htmlContent += 'PBFPubKey: API_publicKey,'; 
                    htmlContent += 'customer_email: \'' + userDetails.Email +'\',    ';     
                    htmlContent += 'amount: ' + Price + ',     ';
                    htmlContent += 'customer_phone: "070",'; 
                    htmlContent += 'currency: "NGN",'; 
                    htmlContent += 'txref:"' + transactionNo + '",  ';
                    htmlContent += 'meta: [{'; 
                        htmlContent += 'metaname: "BOOK TITLE",  '; 
                        htmlContent += 'metavalue: "' + Title + '"     ';     
                        htmlContent += '}],'; 
                        htmlContent += 'onclose: function() {},'; 
                        htmlContent += 'callback: function(response) {'; 
                            htmlContent += '    var txref = response.tx.txRef; ';
                            htmlContent += '   console.log("This is the response returned after a charge", response);';
                            htmlContent += 'if (';
                                htmlContent += '    response.tx.chargeResponseCode == "00" ||';
                                htmlContent += '   response.tx.chargeResponseCode == "0"';
                                htmlContent += ') {';
                            // redirect to a success page
                            htmlContent += ' var paymentDetails = {   '; 
                                htmlContent += ' BookID:' + BookID + ',            ';        
                                htmlContent += 'Reference: "' + transactionNo + '",';
                                htmlContent += 'UserName: "' + userDetails.Email + '",     ';    
                                htmlContent += ' Amount: "' + Price + '", '; 
                                htmlContent += 'PaymentMode: "flutter-card",  ';  
                                htmlContent += 'Status: "success"      ';  
                                htmlContent += '};            ';  
                                htmlContent += 'var json = JSON.stringify(paymentDetails); ';  
                                htmlContent += 'postPaymentData(json); ';  
                                htmlContent += '} else {';  
                            // redirect to a failure page.
                            htmlContent += '}';  
        
                            htmlContent += 'x.close(); ';  
                            htmlContent += ' }';  
                            htmlContent += '});';  
                            htmlContent += '}';  




                                            htmlContent += ' function postPaymentData(paymentDetals) {      ';                               
                                                htmlContent += '$.ajax({                       ';                   
                                                    htmlContent += '  url: "' + API.URL + '/Payment/PaymentUpdate", '; 
                                                    htmlContent += '  type: "POST",      ';            
                                                    htmlContent += 'data: paymentDetals,    ';      
                                                    htmlContent += 'contentType: "application/json; charset=utf-8",  ';
                                                    htmlContent += 'dataType: "json",       ';                       
                                                    htmlContent += ' beforeSend: function (xhr) {    ';          
                                                        htmlContent += '   xhr.setRequestHeader ("Authorization", "Bearer ' + global.token +'");  ';  
                                                        htmlContent += '                                   },     ';         
                                                        htmlContent += 'success: function(result){        ';
                                                            htmlContent += ' $("#resultSuccess").html(result);                                    }}); ';
                                                            htmlContent += '}</script> </body></html>';
                                                            
         


                                                            console.log(htmlContent);  
        return (  
        <Block flex style={styles.container}>
            <WebView
            originWhitelist={['*']}
            source={{html: htmlContent}}
            //max-width='90%'
            scalesPageToFit={Platform.OS === 'ios' ? false : true}
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
