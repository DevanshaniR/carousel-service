const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    image: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    subTitle: {
      required: true,
      type: String,
    },
  },
  { collection: "slide_content" }
);

module.exports = mongoose.model("Data", dataSchema);
