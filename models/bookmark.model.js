const mongoose = require("mongoose")

const bookmarkSchema = mongoose.Schema({
    name:{
        type:String
    },
    subjectId:{
        type:mongoose.Types.ObjectId,
        ref:"subjects"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    }
})

module.exports = mongoose.model("bookmark", bookmarkSchema)