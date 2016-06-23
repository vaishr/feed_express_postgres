var express = require('express');
var router = express.Router();

var verifyUser = require('./helpers').verifyUser;
var getUserfromID = require('./helpers').getUserfromID;
var getUserfromEmail = require('./helpers').getUserfromEmail;
var getUserfromUsername = require('./helpers').getUserfromUsername;
var getFeed = require('./helpers').getFeed;
var addFeedItem = require('./helpers').addFeedItem;

router.get('/', function(req, res) {
    res.render('login', {});
});

router.post('/authenticate', function(req, res) {
    console.log('/auth', req.body);
    var email = req.body.email;
    var userPromise = verifyUser(email, req.body.password);
    userPromise.then(function(row) {
        getUserfromEmail(email).then(function(row) {
            req.session.user = row.id;
            req.session.save();
            console.log('user session set with', req.session.user);
            console.log('req.session after user', req.session);
            res.redirect('/feed');
        });
    }).catch(function(error) {
        res.render('login', {error: 'Invalid email or password'});
    });
});

router.get('/feed', function(req, res) {
    console.log('user req.session.user get feed', req.session.user)
    console.log('req.session get feed', req.session);
    var feedPromises = getFeed();
    feedPromises.then(function(result) {
        res.render('feed', {
            feed: result.reverse(),
            user: req.session.user
        });
    });
});

router.post('/back', function(req, res) {
    res.redirect('/feed');
});

router.post('/feed', function(req, res) {
    console.log('req.body.feed_message', req.body.feed_message);
    console.log('req.session.user', req.session.user); 
    if (!req.session.user) {
        console.log('req.session post to feed', req.session);
        console.log('no req.session.user', req.session.user);
        res.redirect('/');
    } else {
        addFeedItem(req.body.feed_message, req.session.user).then(function(result) {
            console.log("data", result);
            res.redirect('/feed');
        }).catch(function(err) {
            console.log("err", err);
        });
    }
});

router.post('/logout', function(req, res) {
    req.session.destroy();
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
