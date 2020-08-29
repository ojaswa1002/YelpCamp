//all middleware goes here
var middlewareObj={}
var Campground=require("../models/campground")
var Comment=require("../models/comment")

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found")
                res.redirect("back")
            }else{
                //if yes does user own campground
                //foundCampground.author.id is mongoose object aand req.user._id is a string they look alike but are not
                //so we use .equals  a mongoose method to compare
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back")   
                }    
            }
        })  
    }else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err || !foundComment){         
                req.flash("error","Comment not found")       
                res.redirect("back")
            }else{
                //if yes does user own campground
                //foundCampground.author.id is mongoose object aand req.user._id is a string they look alike but are not
                //so we use .equals  a mongoose method to compare and no "=="
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that")                    
                    res.redirect("back")   
                }    
            }
        })  
    }else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that")
    res.redirect("/login")
}

module.exports=middlewareObj