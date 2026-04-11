const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync"); // ✅ wrap async functions

/* =========================
   INDEX + CREATE
   ========================= */
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    wrapAsync(listingController.createListing)
  );

/* =========================
   NEW FORM
   ========================= */
router.get("/new", isLoggedIn, listingController.renderNewForm);

/* =========================
   EDIT FORM (IMPORTANT: ABOVE :id)
   ========================= */
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

/* =========================
   SHOW / UPDATE / DELETE
   ========================= */
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

module.exports = router;
