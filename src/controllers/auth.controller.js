const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.services')
const tokenBlacklistModel = require("../models/blacklist.model")
async function userRegisterController(req,res){

    const {email,password,name} = req.body

    const isExist = await userModel.findOne({
        email:email
    })
    if(isExist){
        return res.status(422).json({
            message:"user already exists with email",
            status : "failed"
        })
    }

    const user = await userModel.create({
        email,password,name
    })
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"3 d"})
    res.cookie("token",token)

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
        token
    }) 

    await emailService.sendRegistrationEmail(user.email,user.name)
}

async function userLoginController(req,res){
    const {email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user){
        return res.status(401).json({
            message:"email or password is invalid"
        })
    }
    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            message:"email or password is INVALID"
        })
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"3d"})
    res.cookie("token",token)

    res.status(200).json({
        user: {
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if(!token){
        return res.status(400).json({
            message : "user logout succcessfully"
        })
    }

        

      await tokenBlacklistModel.updateOne(
        { token: token },
        { token: token },
        { upsert: true }
    )

        res.clearCookie("token")

        res.status(200).json({
            message:"user logout successfully"
        })
}

module.exports = {userRegisterController, userLoginController, userLogoutController};