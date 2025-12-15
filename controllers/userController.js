const User = require("../models/user.js");


// render signup
module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
}


// post signup 
module.exports.postSignup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if(err){
                return next(err)
            }
            req.flash("success", "User was registered !!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message)
        res.redirect("/signup");
    }
}


// render login
module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}


// post login
module.exports.postLogin = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// logout callback
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err); 
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings")
    })
}