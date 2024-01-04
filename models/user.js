const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  membership: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
  admin: { type: Boolean, required: false },
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  // To avoid errors in cases where a user does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for user's first name, last initial
UserSchema.virtual("name_initial").get(function () {
  let familyInitial = this.family_name;
  familyInitial = familyInitial.substr(0, 1);
  let nameInitial = "";
  if (this.first_name && familyInitial) {
    nameInitial = `${this.first_name} ${familyInitial}.`;
  }
  return nameInitial;
});

// Virtual for membership status
UserSchema.virtual("isPremium").get(function () {
  let isPremium = false;
  if (this.membership === "Premium") {
    isPremium = true;
  }
  return isPremium;
});

// A static method to the User model for finding a user by username
UserSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username });
};

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  return `/board/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
