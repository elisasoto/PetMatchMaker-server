const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, 'Name Required'],
      trim: true
    },
    surname: {
      type: String,
      lowercase: true,
      trim: true
    },
    age: {
      type: String,
      lowercase: true,
      trim: true
    },
    living: {
      type: String,
      enum: [
        'WITH PARENTS',
        'WITH PARTNER AND CHILDREN',
        'WITH PARTNER ONLY',
        'WITH ROOMATE',
        'BY MYSELF'
      ],
      default: 'BY MYSELF'
    },
    img: {
      type: String,
      required: true
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
      required: [true, 'Contact Number required'],
      trim: true
    },
    about: {
      type: String
    },
    motivations: {
      type: String
    },
    hoursToSpend: {
      type: String,
      maxlength: 2
    },
    size: {
      type: String,
      enum: ['SMALL', 'MEDIUM', 'BIG', 'XXL', 'ANY'],
      default: 'ANY'
    },
    ageOfDog: {
      type: String,
      enum: ['PUPPY', 'ADULT', 'ANY'],
      default: 'ANY'
    },
    houseType: {
      type: String,
      enum: ['APARTAMENT', 'CHALET', 'HOUSE WITH YARD'],
      default: 'APARTAMENT'
    },
    petLivingArrangement: {
      type: String,
      enum: ['INSIDE HOUSE', 'OUTSIDE HOUSE'],
      default: 'INSIDE HOUSE'
    },
    ammenities: {
      type: String
    },
    otherPets: {
      type: String
    },
    firstPet: {
      type: String
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }],
    deslikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }]
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Users', UserSchema);

module.exports = model;
