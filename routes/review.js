const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewController = require("../controllers/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");

/* =========================
   CREATE REVIEW
   ========================= */
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

/* =========================
   DELETE REVIEW
   ========================= */
router.delete(
  "/:reviewId",   // ✅ FIXED (capital I)
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
