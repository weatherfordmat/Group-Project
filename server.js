var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var path = require('path');
var requestify = require('requestify');
var assert = require('assert');
var colors = require('colors');

var port = process.env.PORT || 3000
var initStr = "hello";
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(bodyParser.json());

router.use(function(req, res, next) {
    console.log("\nClient Connecting\n...".yellow);
    next(); // w/o this we'd be stuck in this router forevs.
});

router.get('/', function(req, res) {
    res.json({
        message: initStr
    });
});

router.route('/matrix').get(function(req, res) {
	var query = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyBh46nqPEIeRGwU23qtQJD8d0pFpShCPCs"
    requestify.get(query).then(function(response) {
                    var data = (response.getBody());
                    res.json({
                        history: data
                    });
                });
});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use('/api', router);
app.listen(port, function() {
 
});

