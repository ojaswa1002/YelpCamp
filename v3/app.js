var express = require("express")
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground=require("./models/campground")
var seedDB  =require("./seeds")

seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine","ejs")



app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
    //Get all campground from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("index", {campgrounds: allCampgrounds})
        }
    });
});


app.post("/campgrounds",function(req ,res){
    //get data from form and add to campground array
    var name= req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newcampground= {name: name, image: image, description:description}
    //create new campground and save to DB
    Campground.create(newcampground,function(err, newlyCreated){
        if(err){
            console.log(err)
        }else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds")
            }
    })
})
    

app.get("/campgrounds/new",function(req, res){
    res.render("new")
})

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(3000,function(){
    console.log("======YelpCamp=====")
})