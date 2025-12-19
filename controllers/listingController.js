const Listing = require("../models/listing");
const axios = require("axios");
require("dotenv").config();


// Index callback
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}


// New listing callback
module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
}


// Show listing callback
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate({
        path: "reviews", 
        populate: { path: "author" }
    }).populate("owner");

    if (!data) {
        req.flash("error", "Listing does not exist anymore");
        return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { data, geoapifyKey: process.env.GEOAPIFY_API_KEY  });
}


// Create listing callback
module.exports.create = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const { location, country } = req.body;
    if (!location || !country){
        req.flash("error", "Location and country are required");
        return res.redirect("/listings/new");
    }

    const geoRes = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
            params: {
                text: `${location}, ${country}`,
                apiKey: process.env.GEOAPIFY_API_KEY,
                limit: 1
            }
        }
    );

    if (!geoRes.data.features || geoRes.data.features.length === 0){
        req.flash("error", "Location not found, Try specific place");
        return res.redirect("/listings/new");
    }
    const coordinates = geoRes.data.features[0].geometry.coordinates;

    const newListing = new Listing({
        ...req.body,
        price: Number(req.body.price), 
        geometry: {
            type: "Point",
            coordinates
        }
    });
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();

    req.flash("success", "New listing added successfully!")
    res.redirect("/listings");
}


// Edit listing callback
module.exports.edit = async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing does not exist anymore");
        return res.redirect("/listings"); 
    }

    let originalImage = data.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { data, originalImage });
}


// Update listing callback
module.exports.update = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const locationChanged = location !== listing.location || country !== listing.country;

    if (locationChanged) {
        const geoRes = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: `${location}, ${country}`,
                    apiKey: process.env.GEOAPIFY_API_KEY,
                    limit: 1
                }
            }
        );

        if (!geoRes.data.features || geoRes.data.features.length === 0) {
            req.flash("error", "Invalid location. Try a more specific place.");
            return res.redirect(`/listings/${id}/edit`);
        }

        listing.geometry = {
            type: "Point",
            coordinates: geoRes.data.features[0].geometry.coordinates
        };
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};


// Delete listing callback
module.exports.delete = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!")
    res.redirect("/listings");
}