const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  googleId:{
    type:String,
    unique:true,
    required:true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type:String,
    required:true,
    unique:true
  },
  photo:{
    type:String,
    required:true
  },
  role:{
    type:String,
    required:true,
    default:"student"
  },
  subjects:[{
    type:mongoose.Types.ObjectId,
    ref:"subjects",
  }],
  last_login:{
    type:Date,
  }
});

module.exports = mongoose.model("user", userSchema)
