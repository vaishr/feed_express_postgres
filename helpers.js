var Q = require('q');
var client = require('./db').client;

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

function getUserfromEmail(email) {
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

function getUserfromID(id) {
  return Q.promise(function(resolve, reject) {
    var query = client.query("SELECT * from users WHERE id='" + id + "';");
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

exports.verifyUser = verifyUser;
exports.getFeed = getFeed;
exports.getUserfromID = getUserfromID;
exports.getUserfromEmail = getUserfromEmail;
exports.addFeedItem = addFeedItem;
