require("dotenv").config();
const { query } = require("express");
const connection = require("../Database/connect");
const { verifyAdmin } = require("../Verify");
const jwt = require("jsonwebtoken");
const getBooks = async (req, res) => {
  let status = 0;
  const connect = await connection();
  let query = "SELECT * FROM book WHERE 1 ";
  let { title, standard, subject, author, type, minPrice, maxPrice, stock } =
    req.query;
  if (title) {
    query += `AND Book_Title="${title}"`;
  }
  if (standard) {
    query += `AND Standard = "${standard}"`;
  }
  if (subject) {
    query += `AND Book_Subject = "${subject}"`;
  }
  if (author) {
    query += `AND Book_Author = "${author}"`;
  }
  if (type) {
    query += `AND Book_Type = "${type}"`;
  }
  if (minPrice) {
    query += `AND Book_Price> = "${minPrice}"`;
  }
  if (maxPrice) {
    query += `AND Book_Price <= "${maxPrice}"`;
  }
  if (stock) {
    query += `AND Stock = "${stock}"`;
  }
  connect.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: "internal Server Error" });
    }
    if (result.length === 0) {
      res.status(401).json({ error: "No Product" });
    } else {
      res.status(200).json(result);
    }
    connect.end();
  });
};

const addBook = async (req, res) => {
  let send = { msg: "", error: "" };
  let adminStatus = await verifyAdmin(req);

  if (adminStatus) {
    let { title, standard, subject, author, type, price, stock } = req.body;
    console.log(title, standard, subject, author, type, price, stock);
    if (
      !title ||
      !standard ||
      !subject ||
      !author ||
      !type ||
      !price ||
      !stock
    ) {
      console.log("hi");
      send.error = "Missing Field";
      res.status(400).json(send);
    } else {
      let query =
        "INSERT INTO book (Book_Title,Standard,Book_Subject,Book_Author,Book_Type,Book_Price,Stock) VALUES (?,?,?,?,?,?,?)";
      const connect = await connection();
      connect.query(
        query,
        [title, standard, subject, author, type, price, stock],
        (err, result) => {
          let status = 0;
          if (err) {
            console.log(err);
            send.error = "Internal Server Error";
            status = 500;
          } else if (result.insertId === 0) {
            send.error = "No Content";
            status = 204;
          } else {
            send.error = "Insert successful";
            status = 200;
          }
          res.status(status).json(send);
        }
      );
    }
  } else {
    send.error = "Unauthorized Access";
    res.status(401).json(send);
  }
};

module.exports = { getBooks, addBook };
