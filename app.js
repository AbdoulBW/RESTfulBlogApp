var bodyParser           = require("body-parser"),
//expressSanitizer = require('express-sanitizer'),
methodOverride       = require("method-override"),
mongoose             = require("mongoose"),
express              = require("express"),
app                  = express();

//APP CONFIG
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//app.use(expressSanitizer);
//below is to use the PUT method since html doesn't support it
app.use(methodOverride("_method"));

// 1  Setting up mongoose. restfulblogapp -> db
mongoose.connect("mongodb://localhost/restfulblogapp", {useMongoClient:true});

//2 setup schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//Store model in object. This object has all methods needed to interact with Mongodb
var Blog = mongoose.model("Blog", blogSchema);

//Add restful routes
app.get("/", function (req,res) {
    res.redirect("/blogs")
});
//add data in db
// Blog.create({
//     title:"first dog blog",
//     image: "https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/Warning-signs-that-your-dog-has-a-heart-problem.jpg?itok=f-lAENHi",
//     body: "body of the blog",
// }, function (err,blog) {
//     if (err) {
//         console.log("Error! nothgin created")
//     } else {
//         console.log("In!")
//     }
// });

//Index route
app.get("/blogs", function (req,res){
    Blog.find({}, function (err,blogs) {
        if (err) {
            console.log("Error");
        }else {
            res.render("index", {blogs:blogs});
        }
    })
});

//NEW Routes
app.get("/blogs/new", function (req,res) {
    res.render("new");
});

//CREATE Route
app.post("/blogs", function (req,res) {
    //the req.body.blog creates a new entry from blog into mongo,
    //callback function is executed next
    //sanitize user input
    //req.body.blog.body =req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,function (err,newBlog) {
        if (err) {
            console.log("Error")
        } else {
            //no error then we redirect the user to the /blogs page
            res.redirect("/blogs")
        }
    });

});

//SHOW Route
app.get("/blogs/:id", function (req,res) {
    //query to find id
    Blog.findById(req.params.id, function (err,foundBlog) {
        if (err){
            res.redirect("/blogs")
        } else {
            //display item in template
            res.render("show",{blog:foundBlog}); // blog contains the id and we pass
            //blog to the show template and access the id trough blog.id
        };
    });
    
});

//EDIT Route
app.get("/blogs/:id/edit",function (req,res) {
    //find blog
    Blog.findById(req.params.id, function (err,foundBlog) {
        if (err) {
            res.redirect("/blogs")
        }else   {
            res.render("edit", {blog:foundBlog})
        }
    })
    //display blog post in a form
})

//UPDATE route
app.put("/blogs/:id", function (req,res) {
    // takes 3 arguments, the id, data and callback
    //sanitize user input
    //req.body.blog.body =req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function (err,updatedBlog) {
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/"+req.params.id)
        }
    })
});

// DESTROY Route
app.delete("/blogs/:id", function (req,res) {
    Blog.findByIdAndRemove(req.params.id,function (err) {
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
})
app.listen(3000, function () {
    console.log("App started");
});