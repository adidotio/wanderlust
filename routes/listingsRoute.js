const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const passport = require("passport");
const { isLoggedIn, isOwner } = require("../middleware.js")

const listingController = require("../controllers/listingController.js")

const multer  = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });



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
router.get("/", wrapAsync(listingController.index));


// New route
router.get("/new", isLoggedIn, listingController.new);


// Show route
router.get("/:id", isLoggedIn, wrapAsync(listingController.show));


// Create route
router.post("/", isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.create));


// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));


// Update route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.update));


// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));


module.exports = router;