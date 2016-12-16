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
         var notes = $('.notes').val().length>0 ? $('.notes').val() : "N/A";
         var contactCell = $('.contactCell').val();
         var address = $('.custAddress').val();
         if(validateInput(name, contactCell, address)){

        
         console.log(name, notes, contactCell, address);
           database.ref().push({
            name_db: name,
            notes_db: notes,
            contactCell_db: contactCell,
            address_db: address,
            });
         return false;}
         else{
            $("input").css("border","2px solid red")
         }
        });
 });
function validateInput(name, contactCell, address){
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var addressChecker = /^[a-zA-Z\s\d\/]*\d[a-zA-Z\s\d\/]*$/
    if (name == "" || contactCell == "" || address == ""){
        return false;
        }
            else if (!contactCell.match(phoneno)){
                return false;
            }
            else if (!address.match(addressChecker)){
                return false;
            }
            else{
                return true;
            }

}

