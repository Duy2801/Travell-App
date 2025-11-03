const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ["transport", "food", "guide", "ticket", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);

module.exports = mongoose.model('Service', serviceSchema);
