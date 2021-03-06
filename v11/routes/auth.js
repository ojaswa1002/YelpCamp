var express=require("express")
var router= express.Router()
var passport=require("passport")
var User=require("../models/user")



router.get("/",function(req,res){
    res.render("landing")
})




//===========
//AUTH ROUTES
//===========
router.get("/register",function(req,res){
    res.render("register")
})

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message)
            res.render("register")
        } else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success", "Welcome to YelpCamp "+ user.username)
                res.redirect("/campgrounds")
            })
        }
    })
})

//LOGIN FORM
router.get("/login",function(req,res){
    res.render("login")
})
//handling login logic
//app.post("/login", middleware, function)
router.post("/login",passport.authenticate("local",
{   
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){
    
})
//logout
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged you out!")
    res.redirect("/campgrounds")
})



module.exports=router;