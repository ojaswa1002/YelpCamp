var express = require("express")
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground=require("./models/campground")
var Comment= require("./models/comment")
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
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
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
    res.render("campgrounds/new")
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
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//==============
//COMMENTS ROUTE
//==============

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{campground: foundCampground})
        }
    })
})

app.post("/campgrounds/:id/comments",function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.loog(err)
            res.redirect("/campgrounds")
        } else{
            //create new comment
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err)
                } else{
                    //connect new campground to campgrounds
                    campground.comments.push(comment)
                    campground.save()
                    //redirect to show page
                    res.redirect("/campgrounds/"+ campground._id)
                }
            })
        }
    })
    
    
    
})

app.listen(3000,function(){
    console.log("======YelpCamp=====")
})