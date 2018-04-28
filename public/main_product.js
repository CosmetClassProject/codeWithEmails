 var productRef;
 var productName,price,category,buyDate,expireDate,shoppingPlace,notification,descriptionText;
 let checkboxes = $('.checkbox');
function getAnswer(){
  var checkedValue = null; 
  for(var i=0; i<checkboxes.length; i++){
      if(checkboxes[i].selected){
          checkedValue = checkboxes[i].value;
          break;
      }    
}
return checkedValue;
}
$('#save-button').on('click',function(event){
  event.preventDefault();
  //get values
  productName = $('#productName').val();
  price = $('#price').val();
  category = $('#category option:selected').text();
  buyDate = $('#buy-date').val();
  expireDate = $('#expire-date').val();
  shoppingPlace = $('#shoppingPlace').val();
  //notification = $('#notification option:selected').text();
  notification = getAnswer();
  descriptionText = $('#description-text').val();
  var value = 0;
  if(notification=== "three"){
      value = 3;
  }else if(notification === "six"){
      value = 6;
  }else if(notification === "nine"){
       value = 9;
  }else if(notification === "twelve"){
      value = 12;
  }else{
      value = 1;
  }
//Get today's date
var thisDate = new moment();
//Get the date to send the email. For presentation purposes this is set to minutes, however will be changed to months 
var notifyDate = thisDate.add(value, 'minute').format('LLL');
//call the sendEmail function
sendMail();
//sendEmail function. Checks every minute(for presentation), if the dates match it will send the email to the user informing them of the expiration 
function sendMail(){
  setTimeout(function(){
    //now will update every minute(for presentation)
      var now = new moment().format('LLL');
      if (now == notifyDate){
          //The email will be sent to this user's email and will hold the name of the product that is due to expire
          emailjs.send("gmail","expiry_notification",{email: email, ProductName: productName});
      }else{
           sendMail();
      }
  //}, 1209600000);
    },60000);
}

  //create the user database node
  if(uid){
    productRef = firebase.database().ref('product/'+uid);
    saveProduct(productName,price,category,buyDate,expireDate,shoppingPlace,notification,descriptionText);
    alert("product info has been saved! ");
    //$('form').trigger('reset');
  }
  else
    alert("user account is not existed!");
});
function saveProduct(productName,price,category,buyDate,expireDate,shoppingPlace,notification,descriptionText){
  var newProduct = productRef.push();//add a new post(with a unique key)
  newProduct.set({//set will rewrite everything
    productName:productName,
    price:price,
    category:category,
    buyDate:buyDate,
    expireDate:expireDate,
    shoppingPlace:shoppingPlace,
    notification:notification,
    descriptionText:descriptionText
  });
}
//I am going to add in the function for sending email in here. 

var showProduct = function(){
    productRef = firebase.database().ref('product');
    //listen for the value existed or not, callback func, after the onAuth
    productRef.on('value',function(snapshot){//db: object of database Ref
      if(uid){
        var db = snapshot.child(uid).val();
        $.each(db,function(index,x){//index is uid here
          //console.log(x);
          $('.container').append('<div class = "'+index+'"></div>');
          //.load() is async, you need callback function 
          $('.'+index+'').load('/block.html',function(){
              $(this).find('.productName').text(x.productName);
              $(this).find('.expireDate').text(x.expireDate);
              $(this).find('.glyphicon-euro').text(x.price);

          });//index


        });//each
        

      }
    });//snapshot
}




