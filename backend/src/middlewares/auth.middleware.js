const jwt = require('jsonwebtoken')

const identifyUser = async(req, res, next) => {
    const token = req.cookies.token

        if(!token){
        return res.status(401).json({
            message: "Unauthoriezd access"
        })
    }

    let decoded

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)

    } catch (error) {
        return res.status(401).json({
            message: "User not authoriezd"
        })
    }

    req.user = decoded
    next()
}

module.exports = identifyUser