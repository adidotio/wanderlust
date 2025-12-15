const Listing = require("../models/listing");


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

    res.render("listings/show.ejs", { data });
}


// Create listing callback
module.exports.create = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing({
        ...req.body,
        price: Number(req.body.price), 
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
    res.render("listings/edit.ejs", { data });
}


// Update listing callback
module.exports.update = async (req, res) =>{
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
}


// Delete listing callback
module.exports.delete = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!")
    res.redirect("/listings");
}