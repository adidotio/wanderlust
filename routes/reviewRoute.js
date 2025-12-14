const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js")

// Server side validation for reviews
const validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new expressError(400, result.error);
    } else{
        next();
    }
}

// Reviews Route 
router.post("/:id/reviews", isLoggedIn, validateReviews, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "Review saved successfully!")
    res.redirect(`/listings/${listing._id}`)
}));


// Delete Reviews Route
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!")
    res.redirect(`/listings/${id}`);
}));


module.exports = router;