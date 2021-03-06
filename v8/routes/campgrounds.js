var express=require("express")
var router= express.Router()
var Campground=require("../models/campground")

router.get("/",function(req,res){
    //Get all campground from DB    
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
});


router.post("/",isLoggedIn ,function(req ,res){
    //get data from form and add to campground array
    var name= req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author= {
        id:req.user._id,
        username:req.user.username
    }
    var newcampground= {name: name, image: image, description:description,author:author}   
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
    

router.get("/new",isLoggedIn ,function(req, res){
    res.render("campgrounds/new")
})

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}


module.exports=router;