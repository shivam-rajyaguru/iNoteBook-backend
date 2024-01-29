const express = require("express");
const router = express.Router();
const User = require("../models/user");

//RouteApi => /api/auth
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const user = await new User(req.body);
    user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ status: "fail", err: error });
  }
});
module.exports = router;
