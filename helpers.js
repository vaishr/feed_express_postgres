var Q = require('q');
var client = require('./db').client;

function verifyUser(email, password) {
  return Q.promise(function(resolve, reject) {
    console.log("query starting");
    var query = client.query("SELECT * FROM users where email=$1", [email]);
    query.on("row", function(row, result) {
      if(row.password === password) {
        resolve(row);
      }
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
    var ts = new Date().getTime();
    var query = client.query("INSERT INTO posts (feed_message, user_id, created_at) VALUES ($1, $2, $3);", [message, user_id, ts]);
    query.on("row", function(row, result) {
      console.log("inside row result", result);
      console.log("query", query)
      resolve(row);
    })
    query.on("end", function(result) {
      console.log("ended");
      resolve();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  })
}

function runQueryList(queryStr) {
  return Q.promise(function(resolve, reject) {
    var query = client.query(queryStr);
    var list = [];
    query.on("row", function(row) {
      list.push(row);
    })
    query.on("end", function() {
      resolve(list);
    });
    query.on("error", function(error) {
      reject(error);
    });
  });
}

function getFeed() {
  return runQueryList("SELECT * FROM posts;")
    .then(function(result) {
      var feedItemPromises = result.map(function(feedItem) {
        if (!feedItem.user_id) {
          return Q.resolve(feedItem);
        }
        var userPromise = getUserfromID(feedItem.user_id);
        var feedItemEmailPromise = userPromise.then(function(userData) {
          console.log(userData);
          if (userData.email) {
            feedItem.email = userData.email;
          }
          if (userData.username) {
            feedItem.username = userData.username;
          }
          return feedItem;
        });
        return feedItemEmailPromise;
      });
      return Q.all(feedItemPromises);
    })
    .catch(function(error) {
      console.log(error);
  });
}

function getUserfromEmail(email) {
  return Q.promise(function(resolve, reject) {
    var query = client.query("SELECT * FROM users WHERE email=$1", [email]);
    query.on("row", function(row, result) {
      resolve(row);
    })
    query.on("end", function(result) {
      resolve();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  })
}

function getUserfromID(id) {
  return Q.promise(function(resolve, reject) {
    var query = client.query("SELECT * from users WHERE id=$1", [id]);
    query.on("row", function(row, result) {
      resolve(row);
    })
    query.on("end", function(result) {
      resolve();
    });
    query.on("error", function(error) {
      console.log("query error: ", error);
      reject(error);
    });
  })
}

function getUserfromUsername(username) {
  return Q.promise(function(resolve, reject) {
    var query = client.query("SELECT * from users WHERE username=$1", [id]);
    query.on("row", function(row, result) {
      resolve(row);
    })
    query.on("end", function(result) {
      resolve();
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
exports.getUserfromUsername = getUserfromUsername;
exports.addFeedItem = addFeedItem;
