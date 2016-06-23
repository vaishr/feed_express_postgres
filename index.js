var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var engines = require('consolidate');
var routes = require('./routes');
var path = require('path');
var pg = require('pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var conString = require(path.join(__dirname, 'config'));

var app = express();

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(session({
    store: new pgSession({
        pg : pg,                                  
        conString : conString        
  }),
    resave: false,
    saveUninitialized: true,
    secret: 'SOMERANDOMSECRETHERE',
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000 
    }
}));

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use('/', routes);

app.listen(3000, function() {
    console.log("listening on 3000");
});

module.exports = app;
