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
      type: Number,
      required: true,
      maxlength: 2
    },
    ageMonthYear: {
      type: String,
      required: true,
      lowercase: true
    },
    weight: {
      type: Number,
      required: true,
      maxlength: 2,
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
      type: String
    },
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shelter'
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
  },
  {
    timestamps: true
  }
);

const model = mongoose.model('Pets', PetSchema);

module.exports = model;
