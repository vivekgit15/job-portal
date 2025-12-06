const jwt = require("jsonwebtoken");

function generateResetToken(userId) {
    return jwt.sign(
        {id:userId},
        process.env.RESET_PASSWORD_SECRET,
        {expiresIn: '15m'}  
    );
}

module.exports = generateResetToken;