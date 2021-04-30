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
        'with parents',
        'with partner and children',
        'with partner only',
        'with roomate',
        'alone'
      ],
      default: 'with parents'
    },
    /*TODO: Confirm the correct definition of this item*/
    img: {
      type: String,
      data: Buffer,
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
      maxlength: 15,
      required: [true, 'Contact Number required'],
      trim: true
    },
    about: {
      type: String,
      maxlength: 280
    },
    motivations: {
      type: String,
      maxlength: 280
    },
    hoursToSpend: {
      type: String,
      maxlength: 2
    },
    size: {
      type: String,
      enum: [
        'Medium: 10-20kg',
        'Small: less than 10kg',
        'Big: 20-40kg',
        'X-Large: over 40kg',
        'any'
      ],
      default: 'any'
    },
    ageOfDog: {
      type: String,
      enum: [
        'less tha a year',
        '1-3 years',
        '4-6 years',
        'over 6 years',
        'any'
      ],
      default: 'any'
    },
    houseType: {
      type: String,
      enum: ['apartament', 'chalet', 'house with yard'],
      default: 'apartament'
    },
    petLivingArrangement: {
      type: String,
      enum: ['inside house', 'outside house'],
      default: 'inside house'
    },
    ammenities: {
      type: String,
      maxlength: 140
    },
    otherPets: {
      type: Boolean
    },
    firstPet: {
      type: Boolean
    },
    likes: { type: mongoose.Schema.Types.ObjectId, ref: 'Pets' },
    matches: { type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Users', UserSchema);

module.exports = model;
