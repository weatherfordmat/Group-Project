var config = {
    apiKey: "AIzaSyBRDe64D5qCPMtJpLSHCL8G8_VvdpvMQgw",
    authDomain: "ontheway-9edc3.firebaseapp.com",
    databaseURL: "https://ontheway-9edc3.firebaseio.com",
    storageBucket: "ontheway-9edc3.appspot.com",
    messagingSenderId: "422948488078"
};
//initialize firebase;
firebase.initializeApp(config);
var database = firebase.database();
var rootRef = database.ref();
$(document).ready(function() {
    database.ref().on("child_added", function(childSnapshot) {
        var name = childSnapshot.val().name_db;
        var address = childSnapshot.val().address_db;
        var cell = childSnapshot.val().contactCell_db;
        var notes = childSnapshot.val().notes_db;
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

       

        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
        
        var dest = address;
         function success(pos) {
            var origin = pos.coords;
            console.log('Your current position is:');
            console.log('Latitude : ' + origin.latitude);
            console.log('Longitude: ' + origin.longitude);
            console.log('More or less ' + origin.accuracy + ' meters.');
        
        var geoURL = "https://delivernow.herokuapp.com/api/matrix/" + origin.latitude +"," +origin.longitude + "/" + dest;
        $.get({
            url: geoURL
        }).done(function(response) {
            $('.table').append("<tr><td>" + childSnapshot.val().name_db + "</td><td>" + address + "</td><td>" + cell + "</td><td><p>" + response.history.rows[0].elements[0].duration.text + "mins.</p></td><td class='status'>open</td><td>" + notes + "</td></tr>")
        });
    }
    });
    //login information shows if the user logs in or registers
    $('.loginInputs').hide();
    $('.panel').css('filter', 'blur(10px)');
    //create a user when submit is pressed;
    //login a user that already exists: N. B. Passwords must be longer than six characters!
    $('#login').on('click', function() {
        login();
    });
    //registering uses the same mechanisms;
    $('.subButton').click(function() {
            login();
        })
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
    getModal('#myModal', '.addCustomer', '.close');
});
//FUNCTIONS TO CALL WITHIN DOCUMENT.READY
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
//logins you if you already are a user
function login() {
    $('.loginInputs').show();
    $('.login').on('click', function() {
        email = $('#email').val().trim();
        password = $('#password').val().trim();
        if (email !== '' && password !== '') {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Looks Like We'll Create A User for You!");
                createUser(email, password);
            });
            $('.panel').css('filter', 'blur(0px)');
            $('.auth').html(email);
            $('.auth').css('color', 'white').css('font-size', '1em').css('font-style', 'italic');
        }
    });
}
//registers you as user if you don't already have login
function createUser(email, password) {
    if (email !== '' && password !== '') {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
        $('.panel').css('filter', 'blur(0px)');
        $('.auth').html(email);
        $('.auth').css('color', 'white').css('font-size', '1em').css('font-style', 'italic');
    } else {
        $('input').css('border', '2px solid red');
    }
}
//Call to open a specific modal; We need to extend this function so that 
//if a user clicks outside the modal it disappears
function getModal(modal, buttonOpen, buttonClose) {
    var modal = $(modal);
    $(buttonOpen).click(function() {
        modal.css('display', 'block');
    });
    $(buttonClose).click(function() {
        modal.css('display', 'none');
    });
}