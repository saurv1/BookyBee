const jwt = require("jsonwebtoken")
const authModel = require("../model/authModel")


const isAutenticated = async (req, res, next) => {

    let token = req.headers.authorization

    if (!token) {
        return res.status(403).json({
            message: "please login"
        })
    }

    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]
    }

    try {
        const decode = jwt.verify(token, "helloworld");
        const doesUserExist = await authModel.findById(decode.id);

        //email,password,role, username

        if (!doesUserExist) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = doesUserExist;
        next();

    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }

}

module.exports = isAutenticated;