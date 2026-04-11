const Listing = require("../models/listing");
const wrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");

/* =========================
   INDEX
   ========================= */
module.exports.index = wrapAsync(async (req, res) => {
  const { search } = req.query;
  let allListings;
  if (search && search.trim() !== "") {
    const regex = new RegExp(search, "i");
    allListings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex }
      ]
    });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index", { allListings, search });
});

/* =========================
   CREATE
   ========================= */
module.exports.createListing = wrapAsync(async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect(`/listings/${listing._id}`);
});

/* =========================
   SHOW
   ========================= */
module.exports.showListing = wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  res.render("listings/show", { listing });
});

/* =========================
   UPDATE
   ========================= */
module.exports.updateListing = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
});

/* =========================
   DELETE
   ========================= */
module.exports.deleteListing = wrapAsync(async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
});

/* =========================
   RENDER NEW FORM
   ========================= */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

/* =========================
   RENDER EDIT FORM
   ========================= */
module.exports.renderEditForm = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  res.render("listings/edit", { listing });
});
