var express=require("express")
var app= express();
var bodyParser= require("body-parser")

app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine","ejs")


var campgrounds=[
    {name:"everest" ,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQEUfGntsfMfi0XEMVIFlmqZDy571rKl--uYo1I6qhOd5DRdCcg&usqp=CAU"},
    {name:"arawali",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQYVirqDFI39e6kG1HHZjO-knNfdhBAl-mUSsVFjBtcxz7bTOMV&usqp=CAU"},
    {name:"western ghats", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRMYFeTJ4Q3xINPOUHvZzt8SljWUFWPgkj3t8wF6KpaIdRK7APE&usqp=CAU"}
]



app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
    

    res.render("campgrounds", {campgrounds:campgrounds})
})


app.post("/campgrounds",function(req ,res){
    //get data from form and add to campground array
    var name= req.body.name;
    var image=req.body.image;
    var newcampground= {name: name, image: image}
    campgrounds.push(newcampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds")
})

app.get("/campgrounds/new",function(req, res){
    res.render("new")
})

app.listen(3000,function(){
    console.log("======YelpCamp=====s")
})