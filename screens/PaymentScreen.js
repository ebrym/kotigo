import React from 'react';
import { View,ScrollView, StyleSheet,WebView,
    AsyncStorage,
    Platform } from 'react-native';



    import { Button, Block, Text, Input, theme } from 'galio-framework';
    import API  from '../constants/globalURL';
const ACCESS_TOKEN = 'access_token';

export default class PaymentScreen extends React.Component {
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
            const Price= parseFloat(bookDetails.Price) * 100 ;
            const userDetails = JSON.parse(global.userDetails);
            console.log(userDetails.Email);  

            var htmlContent = '<html><head>';
            htmlContent += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
            htmlContent += '<script src="https://js.paystack.co/v1/inline.js"></script> ';              
            htmlContent += '<style>img { width:100%; }</style></head>';        
            htmlContent += '<body onload="payWithPaystack()" >             ';    
            htmlContent += '<div id="resultSuccess" ';
            htmlContent += 'style="text-decoration-color: green"></div> ';
            htmlContent += '<div id="resultFail" style="text-decoration-color: red"></div> ';                     
            htmlContent += '<script>                                ';
            htmlContent += 'function payWithPaystack(){';    
                htmlContent += 'var handler = PaystackPop.setup({      ';
                    htmlContent += 'key: \'pk_test_6021bef74aeb2e8276bf85e3744f5c20a9af29af\',  '; 
                    htmlContent += 'email: \'' + userDetails.Email +'\',    ';      
                    htmlContent += 'amount: ' + Price + ',       ';
                    htmlContent += 'currency: "NGN",       ';
                    //htmlContent += 'ref: \'\'+Math.floor((Math.random() * 10000000000) + 1),  ';
                    //htmlContent += 'ref: 6776843523845181,  ';
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
                                        htmlContent += 'PaymentMode: "card",  ';                      
                                        htmlContent += 'Status: "success"      ';                          
                                        htmlContent += '};               ';                                  
                                        htmlContent += 'var json = JSON.stringify(paymentDetails); ';                              
                                        htmlContent += 'postPaymentData(json);    ';                               
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
        <Block flect style={styles.container}>
            <WebView
            originWhitelist={['*']}
            source={{html: htmlContent}}
            width='90'
            scalesPageToFit={(Platform.OS === 'ios') ? false : true}
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
    marginTop: theme.SIZES.BASE * 7,
  },
});
