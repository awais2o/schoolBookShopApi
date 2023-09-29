require("dotenv").config();
const { query } = require("express");
const connection = require("../Database/connect");
const jwt = require("jsonwebtoken");
// function verifyJwtToken(token) {
//   return jwt.verify(token, process.env.SECRET_KEY);
// }
const Login = async (req, res) => {
  let payload = {
    id: "",
    error: "",
  };
  let msg = { msg: "", error: "" };
  let status = 0;
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body.username);
  const connect = await connection();
  let query = "SELECT * FROM STUDENT WHERE Std_Username=?";
  connect.query(query, [username], (err, result) => {
    if (err) {
      console.log("Query error");
      payload.error = err.code;
      msg.error = err.code;
      status = 500;
    }
    if (result.length === 0) {
      console.log("user not found");
      payload.error = "not found";
      msg.error = "not found";
      status = 401;
    } else {
      console.log("user found");
      if (result[0].Std_Password === password) {
        payload.id = result[0].Std_Id;
        msg.msg = "login successful";
        status = 200;
      } else {
        payload.error = "incorrect password";
        msg.error = "incorrect password";
        status = 401;
      }
    }

    let token = jwt.sign(payload, process.env.SECRET_KEY);
    res.header("Authorization", `Bearer ${token}`);
    res.status(status).json(msg);
  });
};

const Signup = async (req, res) => {
  let payload = {
    id: "",
    error: "",
  };
  let msg = {
    msg: "",
  };
  const { username, password } = req.body;

  const connect = await connection();
  let queries = "INSERT INTO student(Std_Username,Std_Password) VALUES (?,?)";
  connect.query(queries, [username, password], async (err, result) => {
    if (err) {
      // console.log(err);
      payload.id = "";
      payload.error = err.code;
      msg.msg = "signup failed";
    } else {
      payload.id = result.insertId;
      payload.error = "";
      msg.msg = "signup successful";
    }
    let token = jwt.sign(payload, process.env.SECRET_KEY);
    res.header("Authorization", `Bearer ${token}`);

    await res.json(msg);
  });

  connect.end();
};

module.exports = { Login, Signup };
