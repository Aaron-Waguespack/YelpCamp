var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");


//Index Route - shows all resources - campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
      if(err){
          console.log(err);
      } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
      }
    });
});


//Create Route - logic of making new campground and redirecting to new campground
// get data from form and add it to array
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // temp check to make sure form is working
    // res.send("you hit the post route")
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description; 
    var author ={
        id:req.user._id,
        username: req.user.username
    };    
    var newCampground = {name:name, price: price, image:image, description:desc, author:author};

    // //create campground temp -old
    // campgrounds.push(newCampground);
    // create new campground and push to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
    //redirect back to campgrounds page        
            res.redirect("/campgrounds");
        }    
    });
});

//NEW route - shows form to submit a post request to add a new campground
// then redirects us back to /campgrounds as a get 
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW route- shows one item from the campgrounds page
// has to be after NEW (campground/new)
router.get("/campgrounds/:id", function(req, res){
    //find campground with provided ID, render show template with that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
          console.log(err);
      } else {
          res.render("campgrounds/show", {campground: foundCampground});
      }
    });

});

//Edit Campgrounds route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
//is user logged in if not redirect
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});    

//update Campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    //redirect to showpage
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});


// Destroy Campground Route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    } else {
        req.flash("success", "Campground Removed")
        res.redirect("/campgrounds");
    }
});
});



module.exports = router;
