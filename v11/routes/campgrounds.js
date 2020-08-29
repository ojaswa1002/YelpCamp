var express=require("express")
var router= express.Router()
var Campground=require("../models/campground")
var middleware=require("../middleware")

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


router.post("/",middleware.isLoggedIn ,function(req ,res){
    //get data from form and add to campground array
    var name= req.body.name;
    var price = req.body.price;
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
    

router.get("/new",middleware.isLoggedIn ,function(req, res){
    res.render("campgrounds/new")
})

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found")
            res.redirect("back");
        } else {
            
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground})
    });                 
});


//UPDATE CAMGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update
    //var data={name:req.body.name, image:req.body.image, description:req.body.description}
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})

//delete route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    })
})


module.exports=router;