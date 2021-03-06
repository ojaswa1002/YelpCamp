var express = require("express")
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var passport=require("passport")
var LocalStrategy=require("passport-local")

var Campground=require("./models/campground")
var Comment= require("./models/comment")
var User=require("./models/user")
var seedDB  =require("./seeds")

var campgroundRoutes=require("./routes/campgrounds")
var commentRoutes=require("./routes/comments")
var indexRoutes=require("./routes/auth")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))


app.set("view engine","ejs")
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "OJ",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser= req.user
    next()
})

//=====TO USE ROUTES====
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes)


app.listen(3000,function(){
    console.log("======YelpCamp=====")
})