var config = {
    apiKey: "AIzaSyBRDe64D5qCPMtJpLSHCL8G8_VvdpvMQgw",
    authDomain: "ontheway-9edc3.firebaseapp.com",
    databaseURL: "https://ontheway-9edc3.firebaseio.com",
    storageBucket: "ontheway-9edc3.appspot.com",
    messagingSenderId: "422948488078"
 };
 firebase.initializeApp(config);

  var database = firebase.database();


 $(document).ready(function(e) {
     $('.submit').click(function() {
         var name = $('.custName').val().trim();
         var contact = $('.contact').val().trim();
         var contactCell = $('.contactCell').val().trim();
         var address= $('.custAddress').val().trim();
           database.ref().push({
         	name_db: name,
            contact_db: contact,
            contactCell_db: contactCell,
         	address_db: address,
         	});
         return false;
  	});
 });