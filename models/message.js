const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

//Virtual for message time/date
MessageSchema.virtual("timestamp_formatted").get(function () {
  let current_timestamp = this.timestamp;
  current_timestamp = current_timestamp.toISOString();
  current_timestamp =
    DateTime.fromISO(current_timestamp).toLocaleString(DateTime.TIME_SIMPLE) +
    ", " +
    DateTime.fromISO(current_timestamp).toLocaleString(DateTime.DATE_SHORT);
  return current_timestamp;
});

// Virtual for messages's URL
MessageSchema.virtual("url").get(function () {
  return `/board/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
