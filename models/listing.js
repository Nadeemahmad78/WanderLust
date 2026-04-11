const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  location: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  image: { url: String, filename: String }
});

module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
