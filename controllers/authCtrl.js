const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.register = async (req,res)=>{
    try {
        const {name,email,password} =req.body;
        
        const  user = await Users.findOne({email});
        if(user){
            return res.status(400).json({msg:"Email already exists..!"});
        }
        if(password.length<6){
            return res.status(400).json({msg:"Password must be atleast 8 characters long"});
        }
 
        // Password needs to be encrypted
        const passwordHash = await bcrypt.hash(password,10);
        const newUser = new Users({
            name,email,password:passwordHash
        })
 
        // Save to Mongodb
        await newUser.save();
 
        // Creation of jsonwebtoken to Authentication
        const accesstoken = createAccessToken({id:newUser._id});
        const refreshtoken = createRefreshToken({id:newUser._id});
        
         
         res.cookie('refreshtoken',refreshtoken,{
             httpOnly:true,
             path:'/user/refresh_token',
             maxAge:7*24*3600*1000  // 7 days
         })
 
         res.json({accesstoken})
       
     } catch (err) {
         return res.status(500).json({msg:err.message});
         
     }
   }

module.exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        const user = await Users.findOne({email})
        if(!user){
            return res.status(400).json({msg:"User do not exist.."})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:"Incorrect Password."})
        }

        //if login success, create access token and refresh token
        const accesstoken = createAccessToken({id:user._id});
        const refreshtoken = createRefreshToken({id:user._id});

        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:'/user/refresh_token',
            maxAge: 7*24*3600*1000  // 7 days
        })
       
        res.json({accesstoken});

     } catch (err) {
         
       return res.status(500).json({msg:err.message})
     }

 }

module.exports.getUser =async (req,res)=>{
    try {
        const user =  await Users.findById(req.user.id).select('-password');
        if(!user){
            return res.status(400).json({msg:"User does not exist"})
        }
        res.json(user);

    } catch (err) {
        return res.status(500).json({msg:err.msg});
    }
}

module.exports.logout = async (req,res)=>{
    try {
        res.clearCookie('refreshtoken',{
            path:'/user/refresh_token'
        })
        return res.json({msg:"Logged Out"})
        
    } catch (err) {
      return res.status(500).json({msg:err.message})
    }
}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'})
}
const createRefreshToken = (user)=>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}