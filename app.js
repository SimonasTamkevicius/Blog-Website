//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const posts =[];
const correctUsername = "test"
const correctPassword = "test123";
let login = false;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-simonas:vFkKwGrkLjh2CXD0@cluster1.prdh7mf.mongodb.net/?retryWrites=true&w=majority");

const postSchema = {
  title: String,
  text: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

  Post.find({}).exec()
    .then(function(postList) {
        res.render("home", {homeContent: homeStartingContent, posts: postList, login: login});
    })
    .catch(function(err) {
      console.error("Error retrieving items:", err);
    });
})

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent, login: login});
})



app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent, login: login});
})


app.get("/compose", function(req, res) {
  res.render("compose", {login: login});
})

app.post("/compose", function(req, res) {

  const postTitle = _.upperFirst (req.body.postTitle);
  const postText = req.body.postText;

  const post = new Post ({
    title: postTitle,
    text: postText
  })

  post.save();
  res.redirect("/");
})

app.get("/posts/:post", function(req, res) {
  let postParam = _.upperFirst(req.params.post);
  console.log(postParam);

  Post.findOne({ title: postParam })
    .then(function(postCustom) {
      if (postCustom) {
        res.render("post", { postTitle: postCustom.title, postText: postCustom.text, login: login });
      } else {
        console.log("Match not found!");
        // Handle the case when the post is not found
        // res.redirect("/");
      }
    })
    .catch(function(err) {
      console.error("Error retrieving post:", err);
      // Handle the error, display an error page, or redirect to a relevant page
      res.redirect("/");
    });
});


app.get("/login", function(req, res) {
  res.render("login");
})

app.post("/login", function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (username === correctUsername && password === correctPassword) {
    console.log("Login Successful");
    login = true;
    res.redirect("/");
  }
})

app.post("/logout",function(req, res) {
  if (req.body.logout === '') {
    login = false;
    res.redirect("/");
  }
})

let port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server has started successfully.");
});
