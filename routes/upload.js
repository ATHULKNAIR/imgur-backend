const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middlewares/auth');
const fs = require('fs');

// upload image to cloudinary 

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

 // Only Users can upload image 

router.post('/upload',(req,res)=>{
    try{
       

        if(!req.files || Object.keys(req.files).length===0){
            return res.status(400).send("No files were uploaded ");

        }
        const file = req.files;
        if(file.size > 1024*1024){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg:"Size too large"})
        }

        if(files.mimetype !=='image/jpeg'&& files.mimetype !== 'image/png' && files.mimetype !=="image/jpg"&& files.mimetype !=="image/gif"){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg:"File format Not supported"});
        }

        cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"images"},async(err,result)=>{
            if(err) throw err;
            removeTmp(file.tempFilePath)
            res.json({public_id : result.public_id, url : result.secure_url})
        })
        if(req.files.mimetype !== 'image/jpeg' && req.files.mimetype !== 'image/png'){
            return res.send("format not supported")
        }   
    }catch(err){
        return res.status(500).json({msg:err.msg});
    }
})

// delete images

router.post('/destroy',auth,(req,res)=>{
    try{
        const {public_id} =req.body;
        if(!public_id){
            return res.status(400).json({msg:"No image selected"});
        }
        cloudinary.v2.uploader.destroy(public_id,async(err,result)=>{
            if(err) throw err;
            res.json({msg:"Image deleted"})
        })
    }catch(err){
        return res.status(500).json({msg:err.msg})
    }
})

const removeTmp = (path)=>{
    fs.unlink(path,err=>{
        if(err) throw err;
    })
}

module.exports = router;