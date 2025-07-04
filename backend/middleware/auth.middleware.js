import jwt from "jsonwebtoken";
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decodedUser = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    req.user = decodedUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
