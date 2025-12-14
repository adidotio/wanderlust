const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const passport = require("passport");
const { isLoggedIn, isOwner } = require("../middleware.js")


// Server side validation for listings
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new expressError(400, error);
    } else{
        next();
    }
}


// Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("index.ejs", { allListing });
}));


// New route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("new.ejs");
});


// Show route
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate({
        path: "reviews", 
        populate: { path: "author" }
    }).populate("owner");

    if (!data) {
        req.flash("error", "Listing does not exist anymore");
        return res.redirect("/listings"); 
    }

    res.render("show.ejs", { data });
}));



// Create route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
  const newListing = new Listing({
    ...req.body,
    price: Number(req.body.price), 
  });
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing added successfully!")
  res.redirect("/listings");
}));


// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing does not exist anymore");
        return res.redirect("/listings"); 
    }
    res.render("edit.ejs", { data });
}));


// Update route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let {title, description, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        price,
        location,
        country,
    }, { new: true, runValidators: true });
    req.flash("success", "Listing updated successfully!")
    res.redirect(`/listings/${id}`);
}));


// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!")
    res.redirect("/listings");
}));

module.exports = router;