var config = {
    apiKey: "AIzaSyBRDe64D5qCPMtJpLSHCL8G8_VvdpvMQgw",
    authDomain: "ontheway-9edc3.firebaseapp.com",
    databaseURL: "https://ontheway-9edc3.firebaseio.com",
    storageBucket: "ontheway-9edc3.appspot.com",
    messagingSenderId: "422948488078"
};
firebase.initializeApp(config);
var database = firebase.database();
var rootRef = database.ref();
$(document).ready(function() {
    //login information shows if the user logs in or registers
    $('.loginInputs').hide();
    $('#register').on('click', function() {
        $('.loginInputs').show();
        $('.registerUser').on('click', function() {
            email = $('#email').val().trim();
            password = $('#password').val().trim();
            if (email !== '' && password !== '') {
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });
                $('.auth').html("<br>" + "Logged In As: " + email);
                $('.auth').css('color', 'white').css('font-size', '1.5em')
            } else {
                $('input').css('border', '2px solid red');
            }
        });
    });
    //create a user when submit is pressed:

    //login a user that already exists:
    $('#login').on('click', function() {
        $('.loginInputs').show();
        $('.registerUser').on('click', function() {
            email = $('#email').val().trim();
            password = $('#password').val().trim();
            if (email !== '' && password !== '') {
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;  
                     $('input').css('border', '2px solid red');                 
                });
            }
        });
    });
    
    //show map view & hide list view;
    $('#toggleMap').on('click', function() {
        $('.panel').animate({
            left: "+=100",
            height: "toggle"
        }, 500);
    });
    //show list view and hide map view;
    $('#toggleList').on('click', function() {
        $('.panel').animate({
            left: "+=100",
            height: "toggle"
        }, 500);
    });
});
/* Warning, each text is 0.0065 cents. Add +1 for US numbers. Use with caution.
to use => sendText('12017016880', '12817430153', 'It works!');
*/
function sendText(from, to, text) {
    $.post({
        url: "https://rest.nexmo.com/sms/json?api_key=09348072&api_secret=c6e4241595ec75fe&from=" + from + "&to=" + to + "&text=" + text,
    }).done(function(response) {
        console.log(response);
    });
};