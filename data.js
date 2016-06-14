var client = require('./db').client;

client.query("INSERT INTO users (firstname, lastname, username, email, password, description) VALUES ('Neil', 'Armstrong', 'neil_a', 'neil@gmail.com', '123', 'First Man on Moon'), ('Coco', 'Chanel', 'cocochanel', 'coco@gmail.com', '1234', 'Fashion Designer'), ('Severus', 'Snape', 'severus', 'severus@gmail.com', 'password', 'Professor at Hogwarts'), ('Test', 'Test', 'testuser', 'testuser@gmail.com', 'test', 'Hi I am a test user')");

client.query("INSERT INTO posts (feed_message, user_id) VALUES ('The greatness of humanity is not in being human, but in being humane.', '1'), ('All that we are is the result of what we have thought.', '2'), ('There are four questions of value in life… What is sacred? Of what is the spirit made? What is worth living for, and what is worth dying for? The answer to each is the same. Only love.','1'), ('Keep away from people who try to belittle your ambitions. Small people always do that, but the really great make you feel that you, too, can become great.','3'), ('Never doubt that a small group of thoughtful, committed citizens can change the world. Indeed, it’s the only thing that ever has','4')");



