#! /usr/bin/env node

console.log("This script populates some users and messages to the database.");
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require("./models/user");
const Message = require("./models/message");

const users = [];
const messages = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createMessages();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// users[0] will always be the same user, regardless of the order
// in which the elements of promise.all's argument complete.
async function userCreate(
  index,
  first_name,
  family_name,
  username,
  membership,
  password
) {
  const userdetail = {
    first_name: first_name,
    family_name: family_name,
    username: username,
    membership: membership,
    password: password,
  };

  const user = new User(userdetail);

  await user.save();
  users[index] = user;
  console.log(`Added user: ${first_name} ${family_name}`);
}

async function messageCreate(index, title, user, text, timestamp) {
  const messagedetail = {
    title: title,
    user: user,
    text: text,
    timestamp: timestamp,
  };

  const message = new Message(messagedetail);
  await message.save();
  messages[index] = message;
  console.log(`Added message: ${title}`);
}

async function createUsers() {
  console.log("Adding Users");
  await Promise.all([
    userCreate(0, "Patrick", "Rothfuss", "proth", "base", "cats"),
    userCreate(1, "Ben", "Bova", "bbova", "base", "dogs"),
    userCreate(2, "Isaac", "Asimov", "iasim", "base", "goats"),
    userCreate(3, "Bob", "Billings", "bbill", "base", "mice"),
    userCreate(4, "Jim", "Jones", "jjone", "base", "cows"),
  ]);
}

async function createMessages() {
  console.log("Adding Messages");
  await Promise.all([
    messageCreate(
      0,
      "Hello",
      users[0],
      "I am finally in everyone",
      "2023-12-20T08:34"
    ),
    messageCreate(
      1,
      "Hi back!",
      users[1],
      "I think we are all just getting in",
      "2023-12-20T08:39"
    ),
    messageCreate(
      2,
      "Good to See Ya",
      users[2],
      "Pat you were first in",
      "2023-12-20T08:42"
    ),
    messageCreate(
      3,
      "Good to be Here",
      users[3],
      "It doesn't matter who was first, just that we all get in.",
      "2023-12-20T08:43"
    ),
    messageCreate(
      4,
      "Last",
      users[4],
      "Well I'm late to the party sorry everyone!",
      "2023-12-20T08:50"
    ),
  ]);
}
