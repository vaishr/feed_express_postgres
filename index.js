var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var engines = require('consolidate');

var app = express();

var client = require('./db').client;

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

function verifyUser(email, password) {
  return client.query("SELECT * FROM users WHERE email='"+ email +"';", function(err, results) {
    if (results.rows.length) {
      console.log('results users query', results);
      console.log('typeof results users query', typeof results);
      if (results.rows[0].password === password) {
        return true;
      }
    }
    return false;
  });
}

function addFeedItem(user, message) {
  return client.query("INSERT INTO posts (id, feed_message, email) VALUES (DEFAULT, '" + message + "','" + user + "')", function(err, results) {
    console.log("addFeedItem results", results);
    return results;
  });
}

function getFeed() {
  var query = client.query("SELECT * FROM posts;", function(err, results) {
    console.log('results getFeed()', results);
    console.log('ytpe of results getFeed()', typeof results);

  //  console.log('getFeed()results.rows', results.rows);
    return results;
  });
  console.log('query', query)
}

function getUser(email) {

}

app.post('/authenticate', function(req, res) {
  if (verifyUser(req.body.email, req.body.password)) {
    res.redirect('/feed');
  }
  else res.redirect('/');
});

app.get('/feed', function(req, res) {

  res.render('feed', {feed: getFeed()});
})

app.post('/feed', function(req, res) {
  addFeedItem(null, req.body.feed_message);
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