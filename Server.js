var express = require('express');
var localStorage = require('localStorage');
var fs = require('fs');

var bodyParser = require('body-parser');
var app = express();
app.use('/', express.static('public',{ index: 'login.html' }));

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 5000;
    try{
        //Routes Configuration
        var routePath = "./routes/";
        fs.readdirSync(routePath).forEach(function (file) {
            if (file != ".DS_Store") {
                var route = "/api/" + file.split(".")[0];
                var routeDef = require("./routes/" + file)(express);
                app.use(route, routeDef);
                console.log("Route Enabled: " + route);
            }
        });
    }catch(err){
        console.error(err);
    }
    
    
    try{
        var listener = app.listen(port, () => {
            console.log("Listening to port " + port);
        });
    }
    catch(err){
        console.error(err);
    }



