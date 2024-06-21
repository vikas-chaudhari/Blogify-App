const jwt = require("jsonwebtoken");
const secret = "1234$vikas@chaudhari$1234";

const createToken = (user) => {
  const payload = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  };

  const token = jwt.sign(payload, secret);
  return token;
};
const verifyToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};

module.exports = {
  createToken,
  verifyToken,
};
