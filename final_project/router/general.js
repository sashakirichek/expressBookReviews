const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require("axios");
const public_users = express.Router();




public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const result = books[req.params.isbn];

  if (!result) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.send(result);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const result = Object.keys(books).filter(id => books[id].author === req.params.author).map(id => books[id]);

  if (result.length === 0) {
    return res.status(404).json({ message: "Books of this author are not found" });
  }

  return res.send(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const result = Object.keys(books).filter(id => books[id].title === req.params.title).map(id => books[id]);

  if (result.length === 0) {
    return res.status(404).json({ message: "Books by this title are not found" });
  }

  return res.send(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const result = books[req.params.isbn];

  if (!result) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.send(result.reviews);
});

module.exports.general = public_users;


const baseUrl = 'https://sashakiriche-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

async function getAllBooks() {
  try {
    const response = await axios.get(baseUrl + '/');
    const books = response.data;
    console.log(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
  }
}

async function getBooksByIsbn(isbn) {
  try {
    const response = await axios.get(baseUrl + '/isbn/' + encodeURIComponent(isbn));
    const books = response.data;
    console.log(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
  }
}


async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(baseUrl + '/author/' + encodeURIComponent(author));
    const books = response.data;
    console.log(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
  }
}


async function getBooksByTitle(title) {
  try {
    const response = await axios.get(baseUrl + '/title/' + encodeURIComponent(title));
    const books = response.data;
    console.log(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
  }
}
