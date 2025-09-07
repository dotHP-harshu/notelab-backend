const mongoose = require("mongoose")

const unitSchema = mongoose.Schema({
    name:{
        type:String
    },
    subjectId:{
        type:mongoose.Types.ObjectId,
        ref:"subjects"
    },
    filePath:{
        type:String
    },
    storageId:{
        type:String
    },
    bookmark_count:{
        type:Number,
        default:0
    }
}, {timestamps:true})

module.exports = mongoose.model("unit", unitSchema)