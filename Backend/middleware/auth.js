const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    try {
        console.log('=== AUTH MIDDLEWARE DEBUG ===');
        console.log('Request cookies:', req.cookies);
        console.log('Request headers:', req.headers);
        
        // Get the token from cookies
        const token = req.cookies.token;

        console.log('Token found:', !!token);
        console.log('Token value:', token);

        if (!token) {
            console.log('No token found - returning 401');
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('JWT verification failed:', err);
                return res.status(403).json({ message: 'Invalid token' });
            }

            console.log('JWT verification successful, user:', user);
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = {
    authenticateToken,
    protect: authenticateToken
};