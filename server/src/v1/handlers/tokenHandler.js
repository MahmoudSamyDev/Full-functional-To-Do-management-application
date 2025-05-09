// jsonwebtoken: To verify tokens
const jsonwebtoken = require("jsonwebtoken");

// User: So we can find the user by ID after decoding the token
const User = require("../models/user");

// Function to decode the token and verify its validity
const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        // Splits "Bearer abc.def.ghi" into ["Bearer", "abc.def.ghi"]
        // Retrieves the actual token part
        const bearer = bearerHeader.split(" ")[1];
        // Tries to verify the token using your JWT secret
        try {
            const tokenDecoded = jsonwebtoken.verify(
                bearer,
                process.env.TOKEN_SECRET_KEY
            );
            return tokenDecoded;
        } catch {
            return false;
        }
    } else {
        return false;
    }
};

// Middleware to verify the token and attach the user to the request object
exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const user = await User.findById(tokenDecoded.id);
        if (!user) return res.status(401).json("Unathorized");
        req.user = user;
        next();
    } else {
        res.status(401).json("Unathorized");
    }
};
