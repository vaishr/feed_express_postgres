# Triangle 

Chat with interesting people in your city

## 1. Getting Started
Clone or download the repo.

Make sure you have postgresDB installed on your computer and open postgres connection in new window.   

In postgres window run: 
`CREATE DATABASE triangle;`

Then run:
`\l;`
and make sure you see the new triange database in your list of databases.

Then connect to this db with this command:
`\c triangle;`

In config.js, change the connection string url to the path of your new database and save.

Then in your terminal from root project directory run:
`node db.js`
to create user and posts tables with specified schema.

In postgres window run: 
`\dt;`
and make sure you see users and posts in the list of relations



## 2. Test Data

In your postgres window run the following commands to create some test data:

INSERT INTO 



## 3. Dependencies

In terminal from root project directory run:

`npm install
  bower install`


## 4. Viewing Project

In terminal from root project directory run:

`npm start`

to start server and navigate to localhost:3000 in your browser.

Then you can login using the email and password of any user in your users table.


## Possible Improvements
Deploy database to make set up simpler
Implement new posts feature to show which posts are newly added
Implement sessions and hash passwords for more security






