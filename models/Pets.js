const mongoose = require('mongoose');
const { Schema } = mongoose;

const PetSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, 'Name Required'],
      trim: true
    },
    age: {
      type: String,
      required: true,
      maxlength: 2
    },
    ageMonthYear: {
      type: String,
      required: true,
      lowercase: true
    },
    weight: {
      type: String,
      required: true,
      maxlength: 3,
      trim: true
    },
    img: {
      type: String,
      data: Buffer,
      required: true
    },
    breed: {
      type: String,
      required: true
    },
    dateArrivalInShelter: {
      type: Date,
      required: true,
      trim: true
    },
    about: {
      type: String,
      maxlength: 280
    },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' },
    likes: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    matches: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Pets', PetsSchema);

module.exports = model;
