require("dotenv").config();
const jwt = require("jsonwebtoken");
const connection = require("./Database/connect");

const verifyAdmin = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return 0;
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    if (decoded.id) {
      const connect = await connection();
      let query = "SELECT Admin_Id from admin WHERE Admin_Id=? ";
      const results = await new Promise((resolve, reject) => {
        connect.query(query, [decoded.id], (err, results) => {
          connect.end();
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (results.length === 0) {
        return 0;
      } else {
        console.log("verify correct");
        return decoded.id;
      }
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
};

module.exports = { verifyAdmin };
