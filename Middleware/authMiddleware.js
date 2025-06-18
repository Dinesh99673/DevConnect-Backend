const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header(process.env.TOKEN_HEADER_KEY)?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach decoded payload to request object
        req.user = decoded;
        
        next(); // Proceed to the next middleware or route handler
    } catch {
        // Token is invalid or expired
        res.status(403).json({ msg: "Invalid token" });
    }
};

export default authenticate;
