const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviewController.js");

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
router.post("/:id/reviews", isLoggedIn, validateReviews, wrapAsync(reviewController.review));


// Delete Reviews Route
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;