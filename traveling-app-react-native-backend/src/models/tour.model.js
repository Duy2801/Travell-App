const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const itinerarySchema = new mongoose.Schema({
  day: Number,
  activities: [String],
});

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    destination: { type: String, required: true },
    duration: String,
    pricePerPerson: { type: Number, required: true },
    itinerary: [itinerarySchema],
    images: [String],
    includedServices: [String],
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
tourSchema.plugin(toJSON);
tourSchema.plugin(paginate);

module.exports = mongoose.model('Tour', tourSchema);
