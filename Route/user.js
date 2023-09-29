const express = require("express");
const { Login, Signup } = require("../Controller/user");
const Route = express.Router();

Route.route("/login").post(Login);
Route.route("/signup").post(Signup);

module.exports = Route;
