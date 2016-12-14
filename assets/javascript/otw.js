var config = {
    apiKey: "AIzaSyBRDe64D5qCPMtJpLSHCL8G8_VvdpvMQgw",
    authDomain: "ontheway-9edc3.firebaseapp.com",
    databaseURL: "https://ontheway-9edc3.firebaseio.com",
    storageBucket: "ontheway-9edc3.appspot.com",
    messagingSenderId: "422948488078"
};
firebase.initializeApp(config);

$(document).ready(function() {
    //show map view & hide list view;
    $('#toggleMap').on('click', function() {
        $('.panel').animate({
            left: "+=100",
            height: "toggle"
        }, 1000);
    });
    //show list view and hide map view;
    $('#toggleList').on('click', function() {
        $('.panel').animate({
            left: "+=100",
            height: "toggle"
        }, 1000);
    });
});

/* Warning, each text is 0.0065 cents. Use with caution.
to use => sendText('12017016880', '12817430153', 'It works!');
*/
function sendText(from, to, text) {
    $.post({
        url: "https://rest.nexmo.com/sms/json?api_key=09348072&api_secret=c6e4241595ec75fe&from=" + from + "&to=" + to + "&text=" + text,
    }).done(function(response) {
        console.log(response);
    });
};