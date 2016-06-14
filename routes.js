var express = require('express');
var router = express.Router();

var verifyUser = require('./helpers').verifyUser;
var getUserfromID = require('./helpers').getUserfromID;
var getUserfromEmail = require('./helpers').getUserfromEmail;
var getUserfromUsername = require('./helpers').getUserfromUsername;
var getFeed = require('./helpers').getFeed;
var addFeedItem = require('./helpers').addFeedItem;

var currentUser;

router.get('/', function(req, res) {
    res.render('login', {});
});

router.post('/authenticate', function(req, res) {
    console.log("/auth", req.body);
    var email = req.body.email;
    var userPromise = verifyUser(email, req.body.password);
    userPromise.then(function(row) {
        getUserfromEmail(email).then(function(row) {
            currentUser = row.id;
        });
        res.redirect('/feed');
    }).catch(function(error) {
        res.redirect('/');
    });
});

router.get('/feed', function(req, res) {
    var feedPromises = getFeed();
    feedPromises.then(function(result) {
        res.render('feed', {
            feed: result.reverse(),
            user: currentUser
        });
    });
});

router.post('/back', function(req, res) {
    res.redirect('/feed');
});

router.post('/feed', function(req, res) {
    console.log('req.body.feed_message', req.body.feed_message);
    console.log('currentUser', currentUser);
    if (!currentUser) {
        res.redirect('/feed');
    } else {
        addFeedItem(req.body.feed_message, currentUser).then(function(result) {
            console.log("data", result);
        }).catch(function(err) {
            console.log("err", err);
        });
        res.redirect('/feed');
    }
});

router.post('/logout', function(req, res) {
    currentUser = null;
    res.redirect('/');
});

router.get('/users/:username', function(req, res) {
    var username = req.params.username;
    var userPromise = getUserfromUsername(username);
    userPromise.then(function(result) {
        res.render('profile', {
            user: result
        });
    });
});


module.exports = router;
