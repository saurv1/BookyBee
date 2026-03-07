const crypto = require("crypto");

const generateHmacSha256Hash = (data, secret) => {
    return crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("base64");
};

module.exports = { generateHmacSha256Hash };
