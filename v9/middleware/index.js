//all middleware goes here
var middlewareObj={}
var Campground=require("../models/campground")
var Comment=require("../models/comment")

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                res.redirect("backs")
            }else{
                //if yes does user own campground
                //foundCampground.author.id is mongoose object aand req.user._id is a string they look alike but are not
                //so we use .equals  a mongoose method to compare
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back")   
                }    
            }
        })  
    }else{
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("backs")
            }else{
                //if yes does user own campground
                //foundCampground.author.id is mongoose object aand req.user._id is a string they look alike but are not
                //so we use .equals  a mongoose method to compare
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back")   
                }    
            }
        })  
    }else{
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports=middlewareObj