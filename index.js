var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var engines = require('consolidate');
var routes = require('./routes');

var currentUser;

var app = express();

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use('/', routes);

app.listen(3000, function() {
   console.log("listening on 3000");
});

module.exports = app;



