const express = require("express");
const { getBooks, addBook } = require("../Controller/product");
const Route = express.Router();

Route.route("/").get(getBooks);
Route.route("/add").post(addBook);
// Route.route("/signup").post();

module.exports = Route;
