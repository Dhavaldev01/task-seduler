const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.auth = async(req, res, next) =>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if(!token){
        return res.status(401).json({message : "User are not authorizad"});
    }
   
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token failed, authorization denied' });
    }
}