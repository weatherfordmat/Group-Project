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

         var name = $('.custName').val();
         var notes = $('.notes').val();
         var contactCell = $('.contactCell').val();
         var address = $('.custAddress').val();
         console.log(name, notes, contactCell, address);
           database.ref().push({
            name_db: name,
            notes_db: notes,
            contactCell_db: contactCell,
            address_db: address,
            });
         return false;
    });
 });

