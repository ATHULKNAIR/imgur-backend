const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image_id :{
        type:String,
        required:true,
        trim : true,
        unique:true
    },
    images : {
        type : Object,
        required : true
    }
});

module.exports = mongoose.model("Images",imageSchema);