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
var options = {
    enableHighAccuracy: true,
    timeout: 8000,
    maximumAge: 0
};
$(document).ready(function() {
    rootRef.on("child_added", function(childSnapshot) {
        var name = childSnapshot.val().name_db;
        var address = childSnapshot.val().address_db;
        var cell = childSnapshot.val().contactCell_db;
        var notes = childSnapshot.val().notes_db.length > 10 ? childSnapshot.val().notes_db.substring(0, 9) + "<button class='btn btn-link'>...more </button>" : childSnapshot.val().notes_db;
        var dest = address;
        var lat = childSnapshot.val().lat;
        var lng = childSnapshot.val().lng;
        //get our current location: two options: success or failure;
        navigator.geolocation.getCurrentPosition(success, error, options);
        //if we don't know where we are, then append all data, leave data column empty;
        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            $('tbody').append("<tr data-lat=" + lat + " data-lng=" + lng + "><td><span style='color: gold' class='glyphicon glyphicon-star-empty' aria-hidden='true'></td><td>" + childSnapshot.val().name_db + "</td><td>" + address + "</td><td>" + cell + "</td><td><button class='btn btn-primary'> Not Avail.</button></td><td class='status'>open</td><td>" + notes + "</td></tr>")
        };
        //if we know where we make a request to our node server;
        function success(pos) { 
            var origin = pos.coords;
            var geoURL = "https://delivernow.herokuapp.com/api/matrix/" + origin.latitude + "," + origin.longitude + "/" + dest;
            $.get({
                url: geoURL
            }).done(function(response) {
                 var numberRecords = childSnapshot.numChildren();
                if (response.history.rows[0].elements[0].duration.text.length > 7) {
                    var total = (response.history.rows[0].elements[0].duration.text).replace(/\hour/g, '60').replace(/\D/g, ' ').trim().split(' ').map(function(a) {
                        return parseInt(a, 10)
                    });
                    var result = total.reduce(function(a, b) {
                        return a + b
                    });
                } else {
                    var result = (response.history.rows[0].elements[0].duration.text).replace(/\D/g, ' ');
                }
                $('tbody').append("<tr class='eachRow'><td><span style='color: gold' class='glyphicon glyphicon-star-empty' aria-hidden='true'></td></span><td class='companyName'>" + childSnapshot.val().name_db + "</td><td>" + address + "</td><td>" + cell + "</td><td><button data-lat=" + lat + " data-lng=" + lng + " class='btn btn-primary dur'>" + result + "</button></td><td style='color: green'; class='status'>open</td><td>" + notes + "</td></tr>")
                    //show lowest value time;
                    if ($('.table tr').length === numberRecords) {
                        readtable();
                    }


            });

        }
        
    });
    
    $('.table').on('click', '.eachRow', function() {  
        $('#companyName').html($(this).find('td:eq(1)').text())
        $('#addressPopup').html($(this).find('td:eq(2)').text());
        $('#numPopup').html($(this).find('td:eq(3)').text());
        $('#timeToArrival').html($(this).find('td:eq(4)').text() + " away");
        $('#notesPopup').html($(this).find('td:eq(6)').text);
    });
    //get the min and max duration;
    $('.autoRoute').on('click', function() {
        getMinimum();
    })
    

    function readtable() {
        $('.table').dataTable({
            "order": [
                [4, "desc"]
            ]
        });
        $('.dur').append(' mins');
        getModal('.modal2', '.dur', '.close2');
        $('.dur').on('click', function() {
                var that = this;
                window.initMap = function initMap() {
                    var routeTo = {
                        lat: Number($(that).attr('data-lat')),
                        lng: Number($(that).attr('data-lng'))
                    };
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 13,
                        center: routeTo
                    });
                    var market = new google.maps.Marker({
                        position: routeTo,
                        map: map,
                    });
                }
                $('.modal2').append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBytQb1gFbAwEOvaDH-PJmh2lds7q2a8CM&callback=initMap">')
            })
            //change the star to be filled or not
    }
    $('.table').on('click', '.glyphicon', function() {
            if ($(this).hasClass('glyphicon-star-empty')) {
                $(this).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
            } else if ($(this).hasClass('glyphicon-star')) {
                $(this).removeClass('glyphicon-star').addClass('glyphicon-star-empty');
            }
        })
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
//gets the shortest and longest duration from your current location;
function getMinimum() {
    var values = $('tr > td:nth-child(5)').text().replace(/\mins/g, '').split(' ');
    values.pop();
    values = values.map(function(a) {
        return parseInt(a, 10)
    });
    var answer = values.sort(function(a, b) {
        return a > b
    });
    var min = Math.min.apply(null, answer);
    var max = Math.max.apply(null, answer);
    console.log("The Shortest Distance is: " + min);
    console.log("The Longest Distance is: " + max);
}
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
                createUser(email, password); //Delete This Line Right Before The Final Presentation!
            });

            $('.panel').css('filter', 'blur(0px)');
            $('.auth').html("username: " + email);
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
        $('.auth').html("username: " + email);
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