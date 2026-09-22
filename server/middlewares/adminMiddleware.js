
import config from "../config/config.js"

export const requireAdmin = (req, res, next) => {
    if (req.headers['x-admin-password'] !== config.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};