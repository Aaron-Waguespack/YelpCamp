var express    = require ("express");
var app        = express();
var mongoose   = require("mongoose");
var bodyParser = require("body-parser");
var seedDB     = require("./seeds");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");




//mongoose connects file to mongo database
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
//automaticly looks for .ejs files
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDB();




// creating Campground, call back function after it is finished being created
// printing error if there is one and printing campground that was created

// Campground.create(
//     {
//         name: "Genric-2 Creek",
//         image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014459df0c87aa5e5bd_340.jpg",
//         description: "This is a generic campsite by a creek"
        
//     },
//     function(err, campground){
//         if(err){
            
//             console.log(err);
//         } else {
//             console.log("Newly Created Campground: ");
//             console.log(campground);
//         }    
//     });

// temperary campground array
// var campgrounds = [
//     {name: "Genric-1 Creek", image: "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f8c170a4efbdb0_340.jpg"},
//     {name: "Genric-2 Creek", image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014459df0c87aa5e5bd_340.jpg"},
//     {name: "Genric-3 Creek", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b014459df0c87aa5e5bd_340.jpg"},
//     {name: "Genric-4 Creek", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f8c079afedb5ba_340.jpg"},
//     ]



// Landing page - landing.ejs
app.get("/", function(req, res){
    res.render("landing");
});

//Index Route - shows all resources - campgrounds
app.get("/campgrounds", function(req, res){
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
    // res.render("campgrounds",{campgrounds:campgrounds});
});

//Create Route - logic of making new campground and redirecting to new campground
// get data from form and add it to array
app.post("/campgrounds", function(req, res){
    // temp check to make sure form is working
    // res.send("you hit the post route")
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description:desc}
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

//NEW - shows form to submit a post request to add a new campground
// then redirects us back to /campgrounds as a get 
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

//SHOW - shows one item from the campgrounds page
// has to be after NEW (campground/new)
app.get("/campgrounds/:id", function(req, res){
    //find campground with provided ID, render show template with that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });

});

//===============
//Comments Routes
//===============

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
    
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});
    //create new comment
    // connect new comment to campground
    // redirect campground show page
    
// generic end of file for cloud9 server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has Started");
});