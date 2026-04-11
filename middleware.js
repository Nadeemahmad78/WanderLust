const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");
const Review = require("./models/review");

// LOGIN CHECK
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

// SAVE REDIRECT URL ✅ (MISSING PART)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// LISTING OWNER CHECK
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// REVIEW AUTHOR CHECK
module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review || !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect("back");
  }
  next();
};

// VALIDATIONS (placeholder)
module.exports.validateReview = (req, res, next) => {
  next();
};

module.exports.validateListing = (req, res, next) => {
  next();
};
