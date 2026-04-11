const Listing = require("../models/listing");
const Review = require("../models/review");
const catchAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");

/* =========================
   CREATE REVIEW
   ========================= */
module.exports.createReview = catchAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  if (!req.body.review) {
    throw new ExpressError("Invalid review data", 400);
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
});

/* =========================
   DELETE REVIEW
   ========================= */
module.exports.destroyReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
});
