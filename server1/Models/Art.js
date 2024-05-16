// Models/Art.js
import mongoose from "mongoose";

const ArtSchema = mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  forSale: {
    type: Boolean,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },

});

const ArtModel = mongoose.model("AddArt", ArtSchema, "AddArt");

export default ArtModel;