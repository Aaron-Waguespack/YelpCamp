var express        = require ("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var flash          = require("connect-flash");
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
var methodOverride = require("method-override");
var Campground     = require("./models/campground");
var Comment        = require("./models/comment");
var User           = require("./models/user");
var seedDB         = require("./seeds");


// Requiring Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//mongoose connects file to mongo database
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
// to make shortcuts for routes this line should look like the below:
// mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
//automaticly looks for .ejs files
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//  - seed the database
// seedDB();

//Passport config
app.use(require("express-session")({
    secret: "1+1=16",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// used to add currentUser: req.user to all routes
app.use(function(req, res, next){
    res.locals.currentUser =req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
})

//added to use seperated routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
// Note: these can include the base routes /campgrounds etc so they do can be removed
// from the individual route files. {mergeParams: true} would need to be added above to the var router

// generic end of file for cloud9 server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has Started");
});

