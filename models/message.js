const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date },
});

// Virtual for messages's URL
MessageSchema.virtual("url").get(function () {
  return `/membersOnly/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
