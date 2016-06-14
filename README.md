# Triangle 

Chat with interesting people in your city

## Getting Started

Clone or download the repo.

In terminal from root project directory run:

```
npm install

bower install
```

to install project dependencies.
  

## Setting up Database

Make sure you have postgresDB installed on your computer and open postgres connection in new window.   

In postgres window run: 

```
CREATE DATABASE triangle;

```

Then run:

```
\l;
```
and make sure you see the new triange database in your list of databases.

Then connect to this db with this command:
```
\c triangle;
```

In config.js, change the connection string url to the path of your new database and save.



## Test Data

In your terminal from root project directory run:
```
node db.js
```
to create user and posts tables with specified schema.

In postgres window run: 
```
\dt;
```
and make sure you see users and posts in the list of relations

To populate test data tables with data, in terminal from root project directory run:

```
node data.js
```

and then in your postgres window run:

```
select * from users;
```

and then:

```
select * from posts;
```

to make sure test data has been added to tables. 


## Viewing Project

In terminal from root project directory run:

```
npm start
```

to start server and navigate to localhost:3000 in your browser.

Then you can login using the email and password of any user in your users table (if you populated your tables with the test data the easiest email/password combo to log in with is:

email: "testuser@gmail.com" 

password: "test"

Once you are logged in successfully you will be redirected to the feed where you can post a new feed post for the logged in user.


## Possible Improvements

* Deploy database to make set up simpler
* Implement new posts feature to show which posts are newly added
* Implement sessions and hash passwords for more security


