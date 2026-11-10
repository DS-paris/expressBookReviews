
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

public_users.get('/', async (req, res) => {
    return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
});

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    return res.status(200).json(result);
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    return res.status(200).json(result);
});

public_users.get('/review/:isbn', async (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;

