const Images = require('../models/imageModel');

class APIfeatures {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString}    // queryString = req.query

        const excludeFields = ['page','sort','limit']
        excludeFields.forEach(e1=>delete(queryObj[e1]))

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=>'$'+match);

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

}

const imageCtrl = {

    createImage :  (req,res)=>{
        try {
            const {image_id,images} = req.body;
            if(!images){
                return res.status(400).json({msg:"No image uploaded"})
            }
            const image =   Images.findOne({image_id})
            if(image){
                return res.status(400).json({msg:"IMage already uploaded"})
            }
            const newImage = new Images({images});
              newImage.save();
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
