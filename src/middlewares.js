const TokenUtils = require("./utils/token");

const fetchTokenMiddleWare = async (req, res, next) => {
  try {
    const token = await TokenUtils.getToken();
    if (!token) {
      token = await TokenUtils.generateToken();
    }
    req.token = token;
    next();
  } catch (error) {
    console.error("Failed to fetch token:", error.message);
    res.status(400).send(`Error: ${error.message}`);
  }
};

module.exports = { fetchTokenMiddleWare };
