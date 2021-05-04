const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShelterSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, 'Name Required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email'
      },
      required: [true, 'Email required']
    },
    password: {
      type: String,
      required: [true, 'Password required']
    },
    phone: {
      type: String,
      maxlength: 15,
      required: [true, 'Contact Number required'],
      trim: true
    },
    city: {
      type: String,
      lowercase: true,
      trim: true
    },
    country: {
      type: String,
      lowercase: true,
      trim: true
    },
    about: {
      type: String
    },
    dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }]
  },
  { timestamps: true }
);

const model = mongoose.model('Shelter', ShelterSchema);

module.exports = model;
