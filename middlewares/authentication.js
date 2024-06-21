const { verifyToken } = require("../services/authentication");

const checkForAuthenticationCookie = (cookieName) => {
  return (req, resp, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) return next();
    try {
      const userPayload = verifyToken(tokenCookieValue);
      req.currentUser = userPayload;
    } catch (error) {
    } finally {
      return next();
    }
  };
};

module.exports = { checkForAuthenticationCookie };
