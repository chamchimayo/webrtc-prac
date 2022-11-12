const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const redisClient = require("./redis");
const refreshModel = require("../models/refresh");
module.exports = {
  sign: (user) => {
    const payload = { id: user._id };
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "30s",
    });
  },

  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return { ok: true, id: decoded.id };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },

  refresh: (user) => {
    const payload = { id: user.id };
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "50s",
    });
  },

  refreshVerify: async (refreshToken) => {
    try {
      const data = await refreshModel.findOne({ refreshToken });
      const [refreshTokenType, refreshTokenValue] = refreshToken.split(" ");
      if (refreshToken === data.refreshToken) {
        try {
          jwt.verify(refreshTokenValue, secret);
          return true;
        } catch (err) {
          return false;
        }
        // } catch (err) {
        // return false;
        // }
      } else {
        return false;
      }
      // } catch (err) {
      // return false;
    } catch (err) {
      return { message: "refreshToken expired" };
    }
    // } catch (err) {
    // return false;
  },
};
// };
