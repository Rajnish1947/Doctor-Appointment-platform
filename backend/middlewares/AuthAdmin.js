
import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login again",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (!token_decode) {
      return res.json({
        success: false,
        message: "Not Authorized, Login again",
      });
    }
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default authAdmin;
