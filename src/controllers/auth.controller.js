const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser (req, res){

    const {username, email, password, role} = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    //If user already exist than return 409 status code with message "User already exists"
    if (isUserAlreadyExist) {
        return res.status(409).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10);

    // If user doesn't exist, create a new user
    const user = await userModel.create({
        username, 
        email, 
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function loginUser (req, res){

    const {username, email, password} = req.body;

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword){
        return res.status(401).json({
            message: "Invalid password"
        })
    }    

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message:"Logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

module.exports = {registerUser, loginUser};