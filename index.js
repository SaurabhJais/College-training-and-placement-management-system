let express = require("express");
let app = express();
require("dotenv").config();
let path = require("path");
let http = require('http').Server(app);
let routes = require("./routes/routes")
const cookieParser = require("cookie-parser");



app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname + "/views/")));
app.use(cookieParser());



// Set isLoggedIn variable to all the ejs templates
app.use((req, res, next) => {
    if (req.cookies['token']) {
        res.locals.isLoggedIn = true;
    } else {
        res.locals.isLoggedIn = false
    }
    next();
})



app.use("/", routes)


app.get("/404-error", (req, res) => {
    res.render("error.ejs");
})


app.get("*", (req, res) => {

    res.redirect("/404-error");
})


http.listen(process.env.PORT, () => {
    console.log("Running like a charm");
})