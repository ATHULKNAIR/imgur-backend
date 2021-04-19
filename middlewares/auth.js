
const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
     
    
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({msg:"Un-authorized"})
    }
    try{
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.status(400).json({msg:"Invalid Authentication"})
        }
    
        req.user = user;
        next();
    });  
    }catch(err){
        res.status(500).json({msg:"Token invalid"});
    }
}

module.exports = auth;