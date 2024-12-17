const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.register = async(req, res) =>{
    const {username , email ,password , role} = req.body;

    try {
        const user = await User.create({username , email , password });
        console.log(user)
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
        })
    } catch (error) {
        console.error("Registration error:", error);
    }
}


exports.login = async(req,res) =>{
    const {email, password} = req.body

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(401).json("User Not Found");
        }

        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return res.status(401).json({ message: "Invalid Passwoed" });
        }
        res.status(200).json({
            success:true,
            token:generateToken(user._id)
        })
    } catch (error) {
     res.status(400).json({message: "login Failed" , error});   
    }

}