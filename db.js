var pg = require('pg');
var path = require('path');
var conString = require(path.join(__dirname, 'config'));

var client = new pg.Client(conString);
client.connect();

client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstname VARCHAR(40), lastname VARCHAR(40), username VARCHAR(40) not null, email VARCHAR(40) not null, password VARCHAR(40) not null, description VARCHAR(255) not null)');
client.query('CREATE TABLE IF NOT EXISTS posts(id SERIAL PRIMARY KEY, feed_message VARCHAR(600) not null, created_at VARCHAR(40), user_id integer REFERENCES users (id))');

exports.client = client;
