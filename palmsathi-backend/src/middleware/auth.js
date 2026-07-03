import jwt from "jsonwebtoken";

export function protect(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.farmer = decoded; // { id, phone, name } available in all protected routes
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token. Please log in again." });
    }
}