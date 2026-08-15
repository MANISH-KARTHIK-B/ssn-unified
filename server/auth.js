import jwt from "jsonwebtoken";

export const JWT_SECRET = "ssn-unified-demo-secret-not-for-production";

export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function attachUser(req, res, next) {
  const headerToken = (req.headers.authorization || "").replace("Bearer ", "");
  const token = req.query.token || headerToken;
  const payload = token ? verifyToken(token) : null;
  req.user = payload || null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  next();
}

export function requireFaculty(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "faculty") return res.status(403).json({ error: "Faculty access only" });
  next();
}
