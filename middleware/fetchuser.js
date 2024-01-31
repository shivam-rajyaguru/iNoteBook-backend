const jwt = require("jsonwebtoken");
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "ThisIsMySecretKey");
    // console.log(data);
    req.user = data;
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
  next();
};
module.exports = fetchuser;
