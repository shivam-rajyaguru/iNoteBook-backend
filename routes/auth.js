const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

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

  let user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user) {
    res
      .status(400)
      .json({ error: "Sorry a user with this emailId already exist" });
  }
  try {
    console.log(req.body);
    const userData = await new User(req.body);
    userData.save();
    res.status(200).json({ status: "Success", User: userData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Fail", error: error });
  }
});
module.exports = router;
