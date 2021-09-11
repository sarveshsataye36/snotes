const jwt = require("jsonwebtoken");
const JWT_SECRETE = "SArvVEshs14789";

const fetchuser = (req, res, next) => {
  // get user from jwt tokken and add id to the req object
  const tokken = req.header("auth-tokken"); // header name auth-tokken
  if (!tokken) {
    res.status(401).send({ error: "Please authrnticate the valid user" });
  }
  try {
    const data = jwt.verify(tokken, JWT_SECRETE);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authrnticate the valid user" });
  }
};
module.exports = fetchuser;
