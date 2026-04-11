const Joi = require("joi");

// Schema for listings
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.alternatives().try(
      Joi.string().allow("", null), // optional simple string
      Joi.object({ 
        url: Joi.string().allow("", null),  // url can be empty
        filename: Joi.string().allow("", null)  // filename can be empty
      })
    ).allow(null, ""), // image itself can be empty
  }).required(),
});

// Schema for reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});
