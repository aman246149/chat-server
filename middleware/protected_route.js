require('dotenv').config();
const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Initialize the verifier with your user pool ID and client ID
const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.AWS_USER_POOL_ID,
    tokenUse: process.env.AWS_TOKEN_USE,  // Use 'id' if you want to verify ID tokens instead
    clientId: process.env.AWS_CLIENT_ID,
});

const verifyToken = async (token) => {
    try {
        //remove Bearer from token
        token = token.split(' ')[1];
        const payload = await verifier.verify(token);
        return payload;
    } catch (err) {
        throw new Error('Token not valid');
    }
};

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    console.log("Coming here Middleware " + req);
    if (!token || token == undefined) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const payload = await verifyToken(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


module.exports = authMiddleware;