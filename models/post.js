const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
  date: Date,
});

module.exports = mongoose.model("Post", PostSchema);
