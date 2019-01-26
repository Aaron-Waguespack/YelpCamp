var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Route Route - landing.ejs
router.get("/", function(req, res){
    res.render("landing");
});

//Register form route
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic route

router.post("/register", function(req, res){
    // user signs up
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        // if problem signing user up, log error render form again
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        // log in user, authenticate and redirect
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});
    
    
// show login form route
router.get("/login", function(req, res){
    res.render("login");
});
// handling login logic route
router.post("/login", passport.authenticate("local",
    {
        failureFlash: true,
        successFlash: true,
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
    
//logout Route    

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been Logged out!");
    res.redirect("/campgrounds");
});    

module.exports = router;