// this is jwt token generator helper function
// returns token string
const jwt = require("jsonwebtoken");

const generateJWTToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = generateJWTToken;