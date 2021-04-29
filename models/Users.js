const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

const model = mongoose.model("Users", UserSchema);

module.exports = model;
