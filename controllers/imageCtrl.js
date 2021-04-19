const Images = require('../models/imageModel');

const imageCtrl = {

    createImage : async (req,res)=>{
        try {
            const {images} = req.body;
            if(!images){
                return res.status(400).json({msg:"No image uploaded"})
            }
            const image = await Images.findOne({image_id})
            if(image){
                return res.status(400).json({msg:"IMage already uploaded"})
            }
            const newImage = new Images({images});
            await newImage.save();
            res.json({msg:"Image uploaded"});
        } catch (err) {
            return res.status(500).json({msg:err.msg})
        }
    },
    getImage : async (req,res)=>{
        try {
            const features =  new APIfeatures(Images.find(),req.query)
            .filtering().sorting();
            
            const image = await features.query;
            res.json({status:'success',result:images.length,image:image})

        } catch (err) {
            return res.status(500).json({msg:err.mg});
        }
    }
}

module.exports = imageCtrl;
