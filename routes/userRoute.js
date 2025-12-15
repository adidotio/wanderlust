const express = require('express');
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/userController.js");


router.get("/signup", userController.renderSignup);

router.post("/signup", wrapAsync(userController.postSignup));

router.get("/login", userController.renderLogin);

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect : "/login", failureFlash : true }), userController.postLogin);

router.get("/logout", userController.logout);

module.exports = router;