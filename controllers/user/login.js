const jwt = require("jsonwebtoken");
const User = require("../../models/user-model");
require("dotenv").config();

const login = async (req, res) => {
  console.log(`login request received ${req.body.username}`);
  const result = await User.find({
    email: req.body.username,
  }).exec();
  if (!result[0]) {
    return res.status(401).json({ code: 2, message: "invalid credential" });
  }
  if (req.body.password === result[0].password) {
    if (result[0].isvalid == true) {
      const token = jwt.sign(
        {
          username: result[0].email,
        },
        process.env.access_token_key,
        { expiresIn: "86400s" } // one day
      );
      res.json({ status: "ok", user: token });
      console.log("login success");
    } else {
      console.log("user not verified");
      return res.status(403).json({ code: 4, error: "verfication error" });
    }
  } else {
    console.log("invalid password");
    res.status(403).json({ code: 2, error: "invalid password" });
  }
};

exports.login = login;