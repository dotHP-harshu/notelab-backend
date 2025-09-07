const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    keywords: [
      {
        type: String,
      },
    ],
    img: {
      data: String,
      contentType: String,
    },
  },
  { timestamps: true }
);

const subjectModel = mongoose.model("subject", subjectSchema);
module.exports = subjectModel;
