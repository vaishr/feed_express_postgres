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
      if (results.rows[0].password === password) {
        return true;
      }
    }
    return false;
  });
}

function addFeedItem(user, message, next) {
  var queryString = "INSERT INTO posts (id, feed_message, email) VALUES (DEFAULT, '" + message + "','" + user + "') RETURNING *";
  var query = client.query(queryString, function(err, results){
    query.on("row", function(row, result) {
      // console.log("inside row event handler");
      // console.log("query", query)
      next();
    })
  })
}

function getFeed() {
  return client.query("SELECT * FROM posts;", function(err, results) {
    console.log('results getFeed()', results);
    console.log('type of results getFeed()', typeof results);
 
  //  console.log('getFeed()results.rows', results.rows);
    return results;
  });
}

function getUser(user_id) {
  return client.query("SELECT * from users WHERE id='" + user_id + "';", function(err, results) {
    console.log('results getuser', results);
    return results;
  });
}

app.post('/authenticate', function(req, res) {
  if (verifyUser(req.body.email, req.body.password)) {
    res.redirect('/feed');
  }
  else res.redirect('/');
});

app.get('/feed', function(req, res) {
  getUser('1');
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