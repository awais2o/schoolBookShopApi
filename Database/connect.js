const mysql = require("mysql");

const connectTo = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "newschool",
};
const connection = async () => {
  let connect = await mysql.createConnection(connectTo);
  console.log("connected to Database");
  return connect;
};

module.exports = connection;
