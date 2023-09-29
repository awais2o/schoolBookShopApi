const express = require("express");
const userHandler = require("./Route/user");
const adminHandler = require("./Route/admin");
const productHandler = require("./Route/product");
const connection = require("./Database/connect");
const parser = require("body-parser");
const App = express();
const PORT = process.env.PORT || 5000;

App.get("/", (req, res) => {
  res.json({ msg: "Welcome to Server, Now go back" });
});
App.use(parser.json());
App.use("/user", userHandler);
App.use("/admin", adminHandler);
App.use("/product", productHandler);
const start = async () => {
  //database connection
  const connect = await connection();
  connect.end();

  App.listen(PORT, () => {
    console.log("listening");
  });
  try {
  } catch (error) {}
};
start();
