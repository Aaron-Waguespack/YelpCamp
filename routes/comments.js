var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index.js");

//Comments new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
    
        }
    });
});

//Comments Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to commnet
               comment.author.id= req.user._id;
               comment.author.username= req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Comment Created!");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});


// Comments Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redrect("back");
        } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});    
    
// Comments Update Route

router.put("/campgrounds/:id/comments/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
           res.redirect("back"); 
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});


// Destroy Route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentsOwnership, function(req, res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment Removed")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router;