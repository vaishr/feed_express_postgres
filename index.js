var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var engines = require('consolidate');
var Q = require('q');

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

var currentUser;

function verifyUser(email, password) {
  return Q.promise(function(resolve, reject) {
    console.log("query starting");
    var query = client.query("select * from users where email=$1", [email]);
    query.on("row", function(row, result) {
      resolve(row);
    });
    query.on("end", function(result) {
      reject();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  });
}


function addFeedItem(message, user_id) {
  return Q.promise(function(resolve, reject) {
    var query = client.query("INSERT INTO posts (feed_message, user_id) VALUES ('" + message + "','" + user_id + "') RETURNING *;");
    query.on("row", function(row, result) {
      console.log("inside row result", result);
      console.log("query", query)
      resolve(row);
    })
     query.on("end", function(result) {
      reject();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  })
}

function getFeed() {
  return Q.promise(function(resolve, reject) {
    var feedPosts = [];
    var query = client.query("SELECT * FROM posts;");
    query.on("row", function(row, result) {
      feedPosts.push(row);
      resolve(feedPosts);
    });
     query.on("end", function(result) {
      console.log("on query end");
      reject();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  })
}

function getUser(email) {
  return Q.promise(function(resolve, reject) {
    var query = client.query("SELECT * from users WHERE email='" + email + "';");
    query.on("row", function(row, result) {
      resolve(row);
    })
    query.on("end", function(result) {
      reject();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  })
}

app.post('/authenticate', function(req, res) {
  console.log("/auth", req.body);
  var email = req.body.email;
  var userPromise = verifyUser(email, req.body.password);
  userPromise.then(function(row) {
    getUser(email).then(function(row) {
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
    res.render('feed', {feed: result});
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



