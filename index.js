var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var engines = require('consolidate');

var verifyUser = require('./helpers').verifyUser;
var getUserfromID = require('./helpers').getUserfromID;
var getUserfromEmail = require('./helpers').getUserfromEmail;
var getFeed = require('./helpers').getFeed;
var addFeedItem = require('./helpers').addFeedItem;

var currentUser;

var app = express();

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/assets', express.static('assets'));
app.use(express.static('bower_components'));

app.get('/', function (req, res) {
  res.render('login', {});
});

app.post('/authenticate', function(req, res) {
  console.log("/auth", req.body);
  var email = req.body.email;
  var userPromise = verifyUser(email, req.body.password);
  userPromise.then(function(row) {
    getUserfromEmail(email).then(function(row) {
      currentUser = row.id;
    })
    res.redirect('/feed');
  }).catch(function(error) {
    res.redirect('/');
  });
});

app.get('/feed', function(req, res) { 
  var feedPromise = getFeed();
  feedPromise.then(function(result) {
    console.log(result);
    res.render('feed', {feed: result.reverse(), user: currentUser});
  })
})

app.post('/feed', function(req, res) {
  console.log('req.body.feed_message', req.body.feed_message)
  addFeedItem(req.body.feed_message, currentUser);
  res.redirect('/feed');
});

app.get('/:user', function(req, res) {
  var user = req.params.user;
  res.render('profile', {user: user});
});

app.post('/logout', function(req, res) {
  res.redirect('/login');
})

app.listen(3000, function() {
   console.log("listening on 3000");
 });

module.exports = app;



