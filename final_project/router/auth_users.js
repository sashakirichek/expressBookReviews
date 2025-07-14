const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const us = users.filter(u => u.username === username);
    return us.length > 0;
}

const authenticatedUser = (username,password)=>{ 
    const us = users.filter(u => u.username === username && u.password === password);
    return us.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    console.log("/login");
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let token = jwt.sign({data: password}, 'secure-secret', {expiresIn: 3600});
        req.session.authorization = {username, accessToken: token};
        return res.status(200).send("User logged in successfully");
    } 

    return res.status(208).json({ message: "Invalid Login. Check username and password" });    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const u = req.session.authorization.username;
    const result = books[req.params.isbn].reviews[u];
    if (result) {
        result.review = req.query.review;
        return res.status(200).json({message: `Review by ${u} modified successfully`});
    } else {
        books[req.params.isbn].reviews[u] = req.query.review;
        return res.status(200).json({message: `Review by ${u} added successfully`});
    }
});


// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const u = req.session.authorization.username;
    if (!books[req.params.isbn].reviews[u]) {
        return res.status(404).json({message: `Review by ${u} for this book is not found`});
    }
    delete books[req.params.isbn].reviews[u];
    return res.status(200).json({message: `Review by ${u} removed successfully`});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
