import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "Token xato" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token xato" });

    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ msg: "Unauthorized" });
  }
}
