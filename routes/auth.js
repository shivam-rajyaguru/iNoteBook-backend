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
router.post("/", validation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json({ status: "fail", err: err });
    });
});
module.exports = router;
