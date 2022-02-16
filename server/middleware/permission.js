const ROLE = require("../constants/role");
const User = require("../models/User");

const verifyAccess = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid token" });
    if (user.role == ROLE.USER)
      return res.json({ success: false, message: "You have not permission" });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = verifyAccess;
