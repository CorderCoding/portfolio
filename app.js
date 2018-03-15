//SETTING UP REQUIREMENTS
var expressSanitizer = require("express-sanitizer"),
methodOverride       = require("method-override"),
LocalStrategy        = require("passport-local"),
flash                = require("connect-flash"),
passport             = require("passport"),
mongoose             = require("mongoose"),
express              = require("express"),
app                  = express();


var User = require("./models/user");
//SETTING UP DEPENDENCIES
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//CONNECTING DB
mongoose.connect(process.env.PORTFOLIODBURL);

//AUTH SETUP
app.use(require('express-session')({ secret: 'M3mb3r83rr!3s', resave: true, saveUninitialized: true }));
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
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/blog");
            });
        }
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});


app.post("/login", passport.authenticate("local", {
        successRedirect: "/blog",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Logged In"
    }), function(req, res){
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/portfolio", function(req, res) {
    res.render("portfolio");
});

app.get("/blog", function(req, res) {
    res.render("blog");
});

//START SERVER
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("========================================");
    console.log("               PORTFOLIO");
    console.log("========================================");
    console.log(Date().toString());
    console.log("========================================");
});