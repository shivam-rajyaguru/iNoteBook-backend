const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validation = [
  body("name", "Name length atlest 3 character").isLength({ min: 3 }),
  body("email", "Email is not valid or incorrect email id").isEmail(),
  body("password", "Password length at least 8 charcter").isLength({ min: 8 }),
];
//RouteApi => /api/auth
// router.post("/", validation, (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   console.log(req.body);
//   const user = new User(req.body);
//   user
//     .save()
//     .then((user) => {
//       res.status(200).json(user);
//     })
//     .catch((err) => {
//       res.status(400).json({ status: "fail", err: err });
//     });
// });
// module.exports = router;

// RouteApi => /api/auth.createuser
router.post("/createuser", validation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log(user);
      res
        .status(400)
        .json({ error: "Sorry a user with this emailId already exist" });
    }
    //using bcryptJs hash your password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // console.log(req.body);
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    //give token to the user

    const authToken = jwt.sign({ _id: userData._id }, "ThisIsMySecretKey");
    console.log(authToken);
    res.status(200).json({ status: "Success", User: userData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Fail", error: error });
  }
});
module.exports = router;
