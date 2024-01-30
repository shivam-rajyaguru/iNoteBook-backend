const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { route } = require("./auth");
const fetchuser = require("../middleware/fetchuser");

const validation = [
  body("name", "Name length atlest 3 character").isLength({ min: 3 }),
  body("email", "Email is not valid or incorrect email id").isEmail(),
  body("password", "Password length at least 8 charcter").isLength({ min: 5 }),
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

//Route-1 create a User using post : /api/auth/createuser . no login required
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
    const data = {
      id: user._id,
    };
    const authToken = jwt.sign({ _id: user._id }, "ThisIsMySecretKey");
    console.log(authToken);
    res.status(200).json({ status: "Success", User: userData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Fail", error: error });
  }
});

const validationLogin = [
  body("email", "Email is not valid or incorrect email id").isEmail(),
  check("password", "Password should not be empty").notEmpty(),
];
//Route-2 Authenticate a User using post : /api/auth/login . no login required
router.post("/login", validationLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }
    const secPass = await bcrypt.compare(password, user.password);
    if (!secPass) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }
    const data = {
      id: user._id,
    };
    const authToken = jwt.sign(data, "ThisIsMySecretKey");
    const token = req.header;
    res.status(200).json({ token: authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route:3 get user using a post : /api/auth/getuser .Login requiered

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById({ _id: userId });
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
