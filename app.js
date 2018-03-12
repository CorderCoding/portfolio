//SETTING UP REQUIREMENTS
var expressSanitizer = require("express-sanitizer"),
methodOverride       = require("method-override"),
LocalStrategy        = require("passport-local"),
flash                = require("connect-flash"),
passport             = require("passport"),
mongoose             = require("mongoose"),
express              = require("express"),
app                  = express();

//SETTING UP DEPENDENCIES
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//CONNECTING DB
mongoose.connect(process.env.PORTFOLIODBURL);

//ROUTES
app.get("/", function(req, res) {
    res.render("landing");
});

//START SERVER
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("========================================");
    console.log("               PORTFOLIO");
    console.log("========================================");
    console.log(Date().toString());
    console.log("========================================");
});