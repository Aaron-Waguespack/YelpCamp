var Campground = require("../models/campground");
var Comment = require("../models/comment");
// All Middleware goes where

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
//is user logged in if not redirect
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else {
 //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
//if so move on to next step with next()                    
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else{
        res.redirect("back");
    }
};
    
middlewareObj.checkCommentsOwnership = function(req, res, next){
//is user logged in if not redirect
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else {
 //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
//if so move on to next step with next()                    
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login");
}

module.exports = middlewareObj;