const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    photoUri:{
        type:String,
        required:false
    },
    
},
{ timestamps: true }
)
module.exports = mongoose.model("Category", categorySchema);
