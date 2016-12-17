var database = firebase.database();


 $(document).ready(function(e) {
      $('.submit').click(function() {

         var name = $('.custName').val();
         var notes = $('.notes').val().length>0 ? $('.notes').val() : "N/A";
         var contactCell = $('.contactCell').val();
         var address = $('.custAddress').val();
         if(validateInput(name, contactCell, address)){
        var geoURL = "https://delivernow.herokuapp.com/api/coords/" +address
        $.get({url: geoURL}).done(function(response) {


         console.log(response.coords.results[0].geometry.location);
           database.ref().push({
            name_db: name,
            notes_db: notes,
            contactCell_db: contactCell,
            address_db: address,
            lat: response.coords.results[0].geometry.location.lat,
            lng: response.coords.results[0].geometry.location.lng
          
            });
           }) 
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

