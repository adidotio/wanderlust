const Review = require("../models/review");
const Listing = require("../models/listing");


// Review callback
module.exports.review = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "Review saved successfully!")
    res.redirect(`/listings/${listing._id}`)
}


// Delete review callback
module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!")
    res.redirect(`/listings/${id}`);
}