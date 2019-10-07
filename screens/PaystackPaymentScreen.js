import React from 'react';
import { View,ScrollView, StyleSheet,
    AsyncStorage,
    Platform } from 'react-native';
import {WebView} from 'react-native-webview';


    import { Button, Block, Text, Input, theme } from 'galio-framework';
    import API  from '../constants/globalURL';
const ACCESS_TOKEN = 'access_token';

export default class PaystackPaymentScreen extends React.Component {
    static navigationOptions = {
        title: 'Payment',
    };
    constructor(props) {
        super(props);
      }
     
      
    render() {
        //let token = Storage.(ACCESS_TOKEN);
            
           // console.log('payment ' + global.token);  
            const { navigation } = this.props;
            const bookDetails=navigation.getParam('paymentDetails');
            //console.log("book details " + bookDetails);  
            const BookID=bookDetails.Id;


            const Title=bookDetails.Title;
            const Price= parseFloat(bookDetails.Price) * 100 ;
            const userDetails = JSON.parse(global.userDetails);
            const transactionNo = 'PS' + Math.floor((Math.random() * 10000000000) + 1);
          //  console.log(userDetails.Email);  

            let htmlContent = '<html><head>';
            htmlContent += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
            htmlContent += '<script src="https://js.paystack.co/v1/inline.js"></script> ';              
            htmlContent += '<style>img { width:100%; }</style></head>';        
            htmlContent += '<body onload="payWithPaystack();" >             ';    
            htmlContent += '<div id="resultSuccess" ';
            htmlContent += 'style="text-decoration-color: green"></div> ';
            htmlContent += '<div id="resultFail" style="text-decoration-color: red"></div> ';                     
            htmlContent += '<script>                                ';
            htmlContent += 'function payWithPaystack(){';    
                htmlContent += 'var handler = PaystackPop.setup({      ';
                    htmlContent += 'key: \'' + API.PAYSTACK_LIVE_PUBLIC_KEY + '\',  '; 
                    htmlContent += 'email: \'' + userDetails.Email +'\',    ';      
                    htmlContent += 'amount: ' + Price + ',       ';
                    htmlContent += 'currency: "NGN",       ';
                    htmlContent += 'ref: \'PS\'+Math.floor((Math.random() * 10000000000) + 1),  ';
                    //htmlContent += 'ref: '+ transactionNo +',  ';
                    htmlContent += 'metadata: {                    ';                  
                        htmlContent += 'custom_fields: [              ';            
                            htmlContent += '{                          '; 
                                htmlContent += 'display_name: "' + userDetails.FirstName + ' ' + userDetails.LastName + '",  ';             
                                htmlContent += 'variable_name: "BOOK TITLE",  ';                  
                                htmlContent += 'value: "' + Title + '"     ';                  
                                htmlContent += '}      ]                    ';            
                                htmlContent += '},                            ';     
                                htmlContent += 'callback: function(response){  ';  
                                    htmlContent += 'var paymentDetails = {    ';              
                                        htmlContent += 'BookID:' + BookID + ',            ';    
                                        htmlContent += 'Reference: \'\'+response.reference,';
                                        htmlContent += 'UserName: "' + userDetails.Email +'",     '; 
                                        htmlContent += 'Amount: "' + Price + '", ';                
                                        htmlContent += 'PaymentMode: "paystack-card",  ';                      
                                        htmlContent += 'Status: "success"      ';                          
                                        htmlContent += '};               ';                                  
                                        htmlContent += 'var details = JSON.stringify(paymentDetails); ';                              
                                        htmlContent += 'postPaymentData(details);    ';                               
                                        htmlContent += '},           ';                          
                                        htmlContent += 'onClose: function(){    ';                            
                                            htmlContent += 'alert(\'window closed\');  ';          
                                            htmlContent += '                 }        ';     
                                            htmlContent += '});          ';                   
                                            htmlContent += 'handler.openIframe();   ';                 
                                            htmlContent += ' }             ';                    
                              
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
            injectedJavaScript={`const meta = document.createElement('meta'); 
                                meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); 
                                meta.setAttribute('name', 'viewport'); 
                                document.getElementsByTagName('head')[0].appendChild(meta); 
                                true;`}
            style={{ flex: 1 }}
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
