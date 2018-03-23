//SETTING UP PACKAGE REQUIREMENTS
var expressSanitizer = require("express-sanitizer"),
methodOverride       = require("method-override"),
LocalStrategy        = require("passport-local"),
flash                = require("connect-flash"),
passport             = require("passport"),
mongoose             = require("mongoose"),
express              = require("express"),
app                  = express();

//SETTING UP ROUTE FILES
var indexRoutes = require("./routes/index"),
userRoutes      = require("./routes/user"),
blogRoutes      = require("./routes/blog"),
commentRoutes   = require("./routes/comment");

//SETUP USER MODEL USER FOR AUTHENTICATION
var User = require("./models/user");

//SETTING UP EXPRESS DEPENDENCIES
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/public", express.static("public"));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//CONNECTING DB
mongoose.connect(process.env.PORTFOLIODBURL);

//AUTH SETUP
app.use(require('express-session')({ secret: process.env.SESSIONSECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//GLOBAL USER VARIABLE
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//ROUTES
app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:post_id/comment", commentRoutes);


//START SERVER
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("========================================");
  console.log("               PORTFOLIO");
  console.log("========================================");
  console.log(Date().toString());
  console.log("========================================");
});
