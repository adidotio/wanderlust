const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://www.hindustantimes.com/ht-img/img/2023/05/31/550x309/johannes-plenio-qkfxBc2NQ18-unsplash_1685517616174_1685517711281.jpg",
        
        set: (v) => v === "" ? "https://www.hindustantimes.com/ht-img/img/2023/05/31/550x309/johannes-plenio-qkfxBc2NQ18-unsplash_1685517616174_1685517711281.jpg" : v,
    },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    country:  { type: String, required: true },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


// Middleware to handle if after adding reviews the listing is deleted all its review should also delete
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;