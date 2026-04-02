require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

const listingsRoute = require("./routes/listingsRoute.js")
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");


// Connection to Database
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL; 

async function main(){
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});


// Mongo DB store to save our sessions
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Db Store");
})


// Imp methods 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);


// Adding session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, //dafuq is this ,math      
        httpOnly: true,
    }
};


app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// All Listing Routes
app.use("/listings", listingsRoute);

// All Review Routes
app.use("/listings", reviewRoute);

// All User Routes
app.use("/", userRoute);   


// Middlewares for error handling
app.all(/.*/, (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Some issue there..." } = err;
    if (res.headersSent) {mm         
        return next(err);
    }
    res.status(status).render("listings/error.ejs", { message });
});


// Server running with port
app.listen(8080, () => {
    console.log("Server is listening...");
});
